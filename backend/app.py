from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from people_count import detect_and_count_people
from counter import Counter, count_data
from ultralytics import YOLO
import threading
from number_plate_detection import NumberPlateDetector, get_plate_data

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Global counter instance
counter_instance = None
processing_thread = None

# Global plate detector instance
plate_detector_instance = None
plate_processing_thread = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/detect-people', methods=['POST'])
def detect_people():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Process the video and get results
            results = detect_and_count_people(filepath)
            
            # Clean up the uploaded file
            os.remove(filepath)
            
            return jsonify({
                'success': True,
                'results': results
            })
        except Exception as e:
            # Clean up the uploaded file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/start-counting', methods=['POST'])
def start_counting():
    global counter_instance, processing_thread
    
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    # Stop any existing counter
    if counter_instance is not None and processing_thread is not None:
        counter_instance.stop_processing()
        processing_thread.join(timeout=3)
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Initialize YOLO model
            model = YOLO('yolov8n.pt')
            
            # Create counter instance
            counter_instance = Counter(filepath, model)
            
            # Start processing in background
            processing_thread = counter_instance.start_processing()
            
            return jsonify({
                'success': True,
                'message': 'People counting started'
            })
        except Exception as e:
            # Clean up the uploaded file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/count-data', methods=['GET'])
def get_count_data():
    """Return current count data as JSON"""
    return jsonify(count_data)

@app.route('/api/start-plate-detection', methods=['POST'])
def start_plate_detection():
    global plate_detector_instance, plate_processing_thread
    
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    # Stop any existing plate detector
    if plate_detector_instance is not None and plate_processing_thread is not None:
        plate_detector_instance.stop_processing()
        plate_processing_thread.join(timeout=3)
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Initialize YOLO model
            model = YOLO('yolov8n.pt')
            
            # Create plate detector instance
            plate_detector_instance = NumberPlateDetector(filepath, model_path='yolov8n.pt')
            
            # Start processing in background
            plate_processing_thread = plate_detector_instance.start_processing()
            
            return jsonify({
                'success': True,
                'message': 'License plate detection started'
            })
        except Exception as e:
            # Clean up the uploaded file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/plate-data', methods=['GET'])
def get_license_plate_data():
    """Return current license plate data as JSON"""
    return jsonify(get_plate_data())

@app.route('/api/stop-plate-detection', methods=['POST'])
def stop_plate_detection():
    global plate_detector_instance
    
    if plate_detector_instance is not None:
        plate_detector_instance.stop_processing()
        return jsonify({'success': True, 'message': 'License plate detection stopped'})
    
    return jsonify({'success': False, 'message': 'No active license plate detection to stop'})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
