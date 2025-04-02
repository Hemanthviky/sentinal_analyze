
from counter import *
from showClassInModel import *
from ultralytics import YOLO

def main():
    video = "../peoplecount1.mp4"
    model = "../yolov8s.pt"
    
    model=YOLO(model)    
    counter=Counter(video,model)
    counter()

if __name__ == "__main__":
    main()