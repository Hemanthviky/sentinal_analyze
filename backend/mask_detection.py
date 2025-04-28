import cv2
import numpy as np
import threading
import time
import random
from ultralytics import YOLO

# Global variable to store mask detection data
mask_data = {
    "timestamp": None,
    "people": [],
    "frame_base64": None,
    "is_processing": False
}

class MaskDetector:
    def __init__(self, video_path, model_path='yolov8n.pt'):
        self.video_path = video_path
        self.model = YOLO(model_path)
        self.is_running = False
        self.cap = None
        self.thread = None
        
    def process_frame(self, frame):
        """Process a single frame to detect people with/without masks"""
        if frame is None:
            return frame, []
        
        # Detect objects with YOLO
        results = self.model(frame, classes=[0])  # Class 0 is person in COCO dataset
        
        # Get annotated frame
        annotated_frame = results[0].plot()
        detected_people = []
        
        # Process each detection from YOLO
        for i, result in enumerate(results[0].boxes):
            box = result.xyxy.tolist()[0]  # Get the box coordinates
            x1, y1, x2, y2 = map(int, box)
            
            # For demonstration, we'll randomly assign mask status
            # In a real implementation, you would use a trained model to detect masks
            has_mask = random.choice([True, False])
            mask_status = "With Mask" if has_mask else "No Mask"
            
            # Set color based on mask status (green for mask, red for no mask)
            color = (0, 255, 0) if has_mask else (0, 0, 255)
            
            # Draw rectangle around the person
            cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
            
            # Add text to the frame
            cv2.putText(
                annotated_frame,
                mask_status,
                (x1, y1-10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                color,
                2
            )
            
            # Store person data
            person_info = {
                "id": i,
                "has_mask": has_mask,
                "box": [x1, y1, x2, y2]
            }
            detected_people.append(person_info)
        
        return annotated_frame, detected_people
    
    def process_video(self):
        """Process video frames continuously"""
        global mask_data
        
        self.cap = cv2.VideoCapture(self.video_path)
        
        if not self.cap.isOpened():
            print(f"Error: Could not open video file {self.video_path}")
            mask_data["is_processing"] = False
            return
        
        mask_data["is_processing"] = True
        
        # Get total frame count
        total_frames = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_count = 0
        reached_end = False
        
        while self.is_running:
            ret, frame = self.cap.read()
            
            if not ret:
                # If we reach the end of the video, mark as complete and stop processing
                if not reached_end:
                    print("Video processing complete")
                    reached_end = True
                    # Set is_processing to False to signal completion
                    mask_data["is_processing"] = False
                    self.is_running = False
                    break
                continue
            
            # Process the frame
            annotated_frame, detected_people = self.process_frame(frame)
            
            # Convert the frame to base64 for web display with better quality
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
            _, buffer = cv2.imencode('.jpg', annotated_frame, encode_param)
            jpg_as_text = buffer.tobytes()
            
            # Update the global mask data
            mask_data["timestamp"] = time.time()
            mask_data["people"] = detected_people
            mask_data["frame_base64"] = jpg_as_text
            
            # Adjust processing speed for smoother video preview
            # Reduced sleep time for more frequent frame updates
            time.sleep(0.01)
        
        # Release resources when stopped
        if self.cap:
            self.cap.release()
        
        mask_data["is_processing"] = False
    
    def start_processing(self):
        """Start processing in a separate thread"""
        if self.is_running:
            return None
            
        self.is_running = True
        self.thread = threading.Thread(target=self.process_video)
        self.thread.daemon = True
        self.thread.start()
        return self.thread
    
    def stop_processing(self):
        """Stop the processing thread"""
        self.is_running = False
        if self.thread:
            self.thread.join(timeout=3)
            self.thread = None

# Function to get the current mask data
def get_mask_data():
    global mask_data
    try:
        # Handle frame_base64 data safely
        frame_base64 = None
        if mask_data["frame_base64"] is not None:
            try:
                # Use base64 encoding for better browser compatibility
                import base64
                frame_base64 = base64.b64encode(mask_data["frame_base64"]).decode('utf-8')
            except (AttributeError, UnicodeDecodeError) as e:
                print(f"Error encoding frame_base64: {e}")
                # If encoding fails, try the old method
                try:
                    frame_base64 = mask_data["frame_base64"].decode('latin1')
                except Exception:
                    # If all fails, just return the raw bytes
                    if isinstance(mask_data["frame_base64"], bytes):
                        frame_base64 = mask_data["frame_base64"]
        
        return {
            "timestamp": mask_data["timestamp"],
            "people": mask_data["people"],
            "frame_base64": frame_base64,
            "is_processing": mask_data["is_processing"]
        }
    except Exception as e:
        print(f"Error in get_mask_data: {e}")
        # Return a safe default response
        return {
            "timestamp": None,
            "people": [],
            "frame_base64": None,
            "is_processing": False,
            "error": str(e)
        }
