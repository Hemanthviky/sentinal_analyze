import cv2
import numpy as np
from ultralytics import YOLO

def detect_and_count_people(video_path):
    # Load YOLO model
    model = YOLO('yolov8n.pt')
    
    # Initialize video capture
    cap = cv2.VideoCapture(video_path)
    
    # Initialize counters
    total_count = 0
    entering_count = 0
    exiting_count = 0
    
    # Get video properties
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    mid_line = frame_width // 2
    
    # Dictionary to track objects
    tracked_objects = {}
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
            
        # Run YOLOv8 tracking on the frame, persisting tracks between frames
        results = model.track(frame, persist=True, classes=[0])  # class 0 is person
        
        if results and results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy()
            track_ids = results[0].boxes.id.cpu().numpy()
            
            for box, track_id in zip(boxes, track_ids):
                x1, y1, x2, y2 = box
                center_x = (x1 + x2) / 2
                
                if track_id not in tracked_objects:
                    tracked_objects[track_id] = {
                        'first_x': center_x,
                        'counted': False
                    }
                elif not tracked_objects[track_id]['counted']:
                    # Determine direction and count
                    if tracked_objects[track_id]['first_x'] < mid_line and center_x > mid_line:
                        entering_count += 1
                        total_count += 1
                        tracked_objects[track_id]['counted'] = True
                    elif tracked_objects[track_id]['first_x'] > mid_line and center_x < mid_line:
                        exiting_count += 1
                        total_count += 1
                        tracked_objects[track_id]['counted'] = True
    
    # Release resources
    cap.release()
    
    return {
        'total': total_count,
        'entering': entering_count,
        'exiting': exiting_count
    }
