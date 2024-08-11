
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";

const RealTimeCamera: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [prediction, setPrediction] = useState("");
  const [allergen, setAllergen] = useState("");
  const [description, setDescription] = useState("");
  const [confidence, setConfidence] = useState<Array<[string, string]>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleStream = useCallback(async () => {
    if (stream) {
      stopCamera();
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    resetPredictions();
  }, [stream]);

  const resetPredictions = useCallback(() => {
    setPrediction("");
    setAllergen("");
    setDescription("");
    setConfidence([]);
  }, []);

  const processCameraFrame = useCallback(() => {
    if (!stream || !videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (context) {
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      const dataURL = canvasRef.current.toDataURL("image/jpeg");
      fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: dataURL }),
      })
        .then((response) => response.json())
        .then((data) => {
          setPrediction(data.prediction);
          setAllergen(data.allergen);
          setDescription(data.description);
          setConfidence(data.confidence);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [stream]);

  const captureImage = useCallback(() => {
    if (!stream || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (context) {
      context.drawImage(
        videoRef.current!,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      const dataURL = canvasRef.current.toDataURL("image/jpeg");
      fetch("http://localhost:5000/api/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: dataURL }),
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.href = data.url;
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [stream]);

  useEffect(() => {
    if (stream) {
      const intervalId = setInterval(processCameraFrame, 1000);
      return () => clearInterval(intervalId);
    }
  }, [stream, processCameraFrame]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Food Allergen Detection - Real-Time Camera
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        <Box>
          <Button variant="contained" color="primary" onClick={handleStream}>
            {stream ? "Stop Camera" : "Use Real-Time Camera"}
          </Button>
          <Box
            sx={{
              width: '100%',  // Adjust the width as needed
              height: 300, // Adjust the height as needed
              overflow: "hidden",
              position: "relative",
              marginY: 2,
            }}
          >
            <Box
              component="video"
              ref={videoRef}
              autoPlay
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // Ensures the video covers the area
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={captureImage}
            disabled={!stream}
          >
            Capture Image
          </Button>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Prediction: {prediction}
          </Typography>
          <Typography variant="h6">Allergen: {allergen}</Typography>
          <Typography variant="h6">Description: {description}</Typography>
        </Box>
        <Box>
          <Typography variant="h6">Confidence Levels:</Typography>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table sx={{ minWidth: "60%" }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Class</TableCell>
                  <TableCell>Confidence</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {confidence.map(([label, confidenceValue], index) => (
                  <TableRow key={index}>
                    <TableCell>{label}</TableCell>
                    <TableCell>{confidenceValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default RealTimeCamera;

