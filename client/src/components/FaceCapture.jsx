import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, CheckCircle2, Loader, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FaceCapture = ({ onCapture, buttonLabel = "Capture & Save Face" }) => {
    const videoRef = useRef();
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [captured, setCaptured] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error("Error loading face models:", err);
                setError("Failed to load face recognition models.");
            }
        };
        loadModels();
    }, []);

    const startVideo = () => {
        setIsCapturing(true);
        setCaptured(false);
        setError('');
        const constraints = {
            video: {
                facingMode: "user",
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                let video = videoRef.current;
                video.srcObject = stream;
                // playsInline required for iOS
                video.setAttribute('playsinline', true);
                video.play();
            })
            .catch((err) => {
                console.error("Error accessing webcam:", err);
                setError("Camera access denied or unavailable.");
                setIsCapturing(false);
            });
    };

    const captureFace = async () => {
        if (!videoRef.current) return;

        try {
            const detection = await faceapi.detectSingleFace(
                videoRef.current,
                new faceapi.SsdMobilenetv1Options({ minConfidence: 0.8 })
            ).withFaceLandmarks().withFaceDescriptor();

            if (detection) {
                // Convert Float32Array to standard JS Array for JSON serialization
                const descriptor = Array.from(detection.descriptor);
                setCaptured(true);
                setIsCapturing(false);
                stopVideo();
                onCapture(descriptor);
            } else {
                setError("No face detected. Please face the camera clearly.");
            }
        } catch (err) {
            console.error(err);
            setError("Error processing image.");
        }
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    useEffect(() => {
        return () => stopVideo(); // Cleanup on unmount
    }, []);

    if (!modelsLoaded) {
        return (
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Loader className="animate-spin h-5 w-5 text-violet-600 mr-2" />
                <span className="text-gray-600 font-medium">Loading AI Models...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            {error && (
                <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg w-full text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!isCapturing && !captured && (
                <button
                    type="button"
                    onClick={startVideo}
                    className="w-full bg-violet-100 hover:bg-violet-200 text-violet-700 py-3 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2"
                >
                    <Camera className="w-5 h-5" />
                    <span>Open Camera to Scan Face</span>
                </button>
            )}

            {isCapturing && (
                <div className="relative rounded-2xl overflow-hidden w-full max-w-sm aspect-[3/4] sm:aspect-video bg-black shadow-inner">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                        autoPlay
                        playsInline
                        muted
                    />
                    <div className="absolute inset-0 border-4 border-violet-500/30 rounded-2xl pointer-events-none"></div>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <button
                            type="button"
                            onClick={captureFace}
                            className="bg-violet-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-violet-700 transition"
                        >
                            {buttonLabel}
                        </button>
                    </div>
                </div>
            )}

            {captured && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center p-4 w-full"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <span className="text-green-700 font-bold">Face Successfully Scanned</span>
                    <button
                        type="button"
                        onClick={startVideo}
                        className="text-violet-600 text-sm font-semibold mt-2 hover:underline"
                    >
                        Retake
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default FaceCapture;
