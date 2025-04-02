import cv2
import numpy as np
import time
import os
import pandas as pd
from datetime import datetime
from ultralytics import YOLO
import easyocr
import threading
from collections import defaultdict
import base64

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'], gpu=False)

# Global variables
plate_data = {
    "plates": [],
    "processing_complete": False,
    "current_frame": None
}

class NumberPlateDetector:
    def __init__(self, video_path, model_path='yolov8n.pt'):
        self.video_path = video_path
        self.model = YOLO(model_path)
        self.stop_flag = False
        self.processing_thread = None
        self.detected_plates = []
        self.plate_images = []
        self.plate_confidences = []
        self.plate_timestamps = []
        self.excel_path = os.path.join('uploads', 'license_plates.xlsx')
        
        # Create uploads directory if it doesn't exist
        if not os.path.exists('uploads'):
            os.makedirs('uploads')
    
    def detect_license_plate(self, vehicle_img):
        """
        Detect license plate in a vehicle image using traditional CV techniques
        """
        # Convert to grayscale
        gray = cv2.cvtColor(vehicle_img, cv2.COLOR_BGR2GRAY)
        
        # Apply bilateral filter to remove noise while keeping edges sharp
        blur = cv2.bilateralFilter(gray, 11, 17, 17)
        
        # Find edges
        edged = cv2.Canny(blur, 30, 200)
        
        # Find contours
        cnts, _ = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:10]
        
        plate_contour = None
        plate_img = None
        plate_coords = None
        
        # Loop through contours to find license plate
        for c in cnts:
            perimeter = cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, 0.02 * perimeter, True)
            
            # If contour has 4 points, it might be a license plate
            if len(approx) == 4:
                plate_contour = approx
                x, y, w, h = cv2.boundingRect(c)
                
                # Check aspect ratio of potential license plate
                aspect_ratio = w / float(h)
                if 2 <= aspect_ratio <= 5.5:  # Common aspect ratio for license plates
                    plate_img = vehicle_img[y:y+h, x:x+w]
                    plate_coords = (x, y, w, h)
                    break
        
        return plate_img, plate_coords
    
    def recognize_plate_text(self, plate_img):
        """
        Use EasyOCR to recognize text on license plate
        """
        if plate_img is None:
            return None, 0
        
        # Preprocess the image for better OCR
        gray = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Recognize text
        results = reader.readtext(thresh)
        
        plate_text = ""
        confidence = 0
        
        # Combine all detected text
        if results:
            for result in results:
                text = result[1]
                conf = result[2]
                
                # Filter out unlikely license plate characters
                filtered_text = ''.join(c for c in text if c.isalnum())
                
                if filtered_text:
                    plate_text += filtered_text + " "
                    confidence = max(confidence, conf)
        
        return plate_text.strip(), confidence
    
    def process_video(self):
        """
        Process video to detect vehicles and license plates
        """
        global plate_data
        
        # Reset plate data
        plate_data["plates"] = []
        plate_data["processing_complete"] = False
        plate_data["current_frame"] = None
        
        # Clear previous detections
        self.detected_plates = []
        self.plate_images = []
        self.plate_confidences = []
        self.plate_timestamps = []
        
        # Open video file
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            print(f"Error: Could not open video file {self.video_path}")
            plate_data["processing_complete"] = True
            return
        
        # Vehicle classes in COCO dataset (car, motorcycle, bus, truck)
        vehicle_classes = [2, 3, 5, 7]
        
        frame_count = 0
        start_time = time.time()
        
        # Process each frame
        while cap.isOpened() and not self.stop_flag:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Process every 3 frames to improve performance
            if frame_count % 3 != 0:
                continue
            
            # Get current timestamp
            timestamp = time.time() - start_time
            
            # Create a copy of the frame for visualization
            display_frame = frame.copy()
            
            # Detect vehicles in the frame
            results = self.model(frame)
            
            # Process each detection
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    # Check if the detected object is a vehicle
                    cls_id = int(box.cls.item())
                    if cls_id in vehicle_classes:
                        # Get coordinates of the vehicle
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                        
                        # Draw vehicle bounding box
                        cv2.rectangle(display_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        
                        # Extract vehicle image
                        vehicle_img = frame[y1:y2, x1:x2]
                        
                        # Skip if vehicle image is too small
                        if vehicle_img.size == 0 or vehicle_img.shape[0] < 20 or vehicle_img.shape[1] < 20:
                            continue
                        
                        # Detect license plate in the vehicle
                        plate_img, plate_coords = self.detect_license_plate(vehicle_img)
                        
                        # Skip if no plate is detected
                        if plate_img is None or plate_img.size == 0 or plate_coords is None:
                            continue
                        
                        # Recognize text on the license plate
                        plate_text, confidence = self.recognize_plate_text(plate_img)
                        
                        # Skip if no text is detected or confidence is too low
                        if not plate_text or confidence < 0.5:
                            continue
                        
                        # Calculate absolute coordinates of the license plate in the original frame
                        px, py, pw, ph = plate_coords
                        abs_x = x1 + px
                        abs_y = y1 + py
                        
                        # Draw license plate bounding box on display frame (red)
                        cv2.rectangle(display_frame, (abs_x, abs_y), (abs_x + pw, abs_y + ph), (0, 0, 255), 2)
                        
                        # Add text above the license plate
                        cv2.putText(display_frame, plate_text, (abs_x, abs_y - 10), 
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
                        
                        # Save the detection
                        self.detected_plates.append(plate_text)
                        self.plate_images.append(plate_img)
                        self.plate_confidences.append(confidence)
                        self.plate_timestamps.append(timestamp)
                        
                        # Update plate data for API
                        # Convert plate image to base64 for frontend
                        _, buffer = cv2.imencode('.jpg', plate_img)
                        img_str = f"data:image/jpeg;base64,{base64.b64encode(buffer).decode('utf-8')}"
                        
                        # Check if this plate is already in the list
                        existing_plate = next((p for p in plate_data["plates"] if p["text"] == plate_text), None)
                        
                        if existing_plate:
                            # Update existing plate with better confidence if applicable
                            if confidence > existing_plate["confidence"]:
                                existing_plate["confidence"] = float(confidence)
                                existing_plate["image"] = img_str
                                existing_plate["timestamp"] = timestamp
                        else:
                            # Add new plate
                            plate_data["plates"].append({
                                "text": plate_text,
                                "confidence": float(confidence),
                                "timestamp": timestamp,
                                "image": img_str
                            })
            
            # Convert the display frame to base64 for streaming
            _, buffer = cv2.imencode('.jpg', display_frame)
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            plate_data["current_frame"] = f"data:image/jpeg;base64,{frame_base64}"
            
            # Check if processing should be stopped
            if self.stop_flag:
                break
        
        # Release video capture
        cap.release()
        
        # Save detections to Excel
        self.save_to_excel()
        
        # Mark processing as complete
        plate_data["processing_complete"] = True
    
    def save_to_excel(self):
        """
        Save detected license plates to Excel file
        """
        if not self.detected_plates:
            return
        
        # Create DataFrame
        current_date = datetime.now().strftime("%Y-%m-%d")
        data = {
            "Date": [current_date] * len(self.detected_plates),
            "License Plate": self.detected_plates,
            "Confidence": self.plate_confidences,
            "Timestamp (s)": self.plate_timestamps
        }
        
        df = pd.DataFrame(data)
        
        # Check if file exists
        if os.path.exists(self.excel_path):
            # Append to existing file
            existing_df = pd.read_excel(self.excel_path)
            df = pd.concat([existing_df, df], ignore_index=True)
        
        # Save to Excel
        df.to_excel(self.excel_path, index=False)
        print(f"License plate data saved to {self.excel_path}")
    
    def start_processing(self):
        """
        Start processing in a separate thread
        """
        self.stop_flag = False
        self.processing_thread = threading.Thread(target=self.process_video)
        self.processing_thread.start()
        return self.processing_thread
    
    def stop_processing(self):
        """
        Stop processing
        """
        self.stop_flag = True
        if self.processing_thread and self.processing_thread.is_alive():
            self.processing_thread.join(timeout=3)
        return

# Function to get plate data for API
def get_plate_data():
    """
    Return current plate data as JSON
    """
    return plate_data
