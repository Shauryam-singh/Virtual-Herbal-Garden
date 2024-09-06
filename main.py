import os
import pickle
from src.video_analytics import VideoAnalytics
from src.anomaly_detection import AnomalyDetection
from src.Speech_analyse import record_audio, alert_if_distress, train_model

if __name__ == "__main__":
    video_analytics = VideoAnalytics(video_source=r"video\sample.mp4")
    anomaly_detection = AnomalyDetection()

    data_sample = [0.6, 0.7, 0.5]

    video_analytics.process_video()

    if not os.path.exists(r'model\model.pkl') or not os.path.exists(r'model\scaler.pkl'):
        print("Model or scaler not found. Training the model...")
        train_model()
    
    # Load the model and scaler
    with open(r'model\model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open(r'model\scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    
    # Record audio and detect distress
    audio_signal = record_audio()
    alert_if_distress(audio_signal, model, scaler)