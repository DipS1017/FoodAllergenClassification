
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import UploadIcon from '@mui/icons-material/Upload';

// Custom StyledTableCell with responsive font sizes and h4 typography
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    fontSize: "0.8rem",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "1rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.2rem",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "1.4rem",
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: "1.6rem",
  },
}));

const ResponsiveTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    fontSize: "1.22rem",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.4rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.6rem",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "1.8rem",
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: "2rem",
  },
}));

const RealTimeCamera: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [prediction, setPrediction] = useState("");
  const [allergen, setAllergen] = useState("");
  const [description, setDescription] = useState("");
  const [confidence, setConfidence] = useState<Array<[string, string]>>([]);
  const [dataAvailable, setDataAvailable] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

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
    setDataAvailable(false);
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
          setDataAvailable(true); // Set to true when data is available
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

      // Navigate to the CapturedPicture page and pass the image data
      navigate('/captured-picture', {
        state: { image: dataURL }
      });
    }
  }, [stream, navigate]);

  const handleNavigateToCaptureImg = () => {
    navigate('/captured-picture');
  };

  useEffect(() => {
    if (stream) {
      const intervalId = setInterval(processCameraFrame, 1000);
      return () => clearInterval(intervalId);
    }
  }, [stream, processCameraFrame]);

  return (
    <Box sx={{ padding: 4 }}>
      <ResponsiveTypography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", color: "#454B1B" }}
      >
        Food Allergen Detection - Real-Time Camera
      </ResponsiveTypography>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={handleStream}>
              {stream ? "Stop Camera" : "Use Real-Time Camera"}
            </Button>
            {!stream && (
              <Typography
                sx={{
                  marginTop: 2,
                  color: "text.secondary",
                  textAlign: "center",
                }}
              >
                Press the above button and allow camera for real-time feature
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: 'auto',
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
                  height: "auto",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={captureImage}
              disabled={!stream}
              sx={{ marginBottom: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}
            >
              Capture Image
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleNavigateToCaptureImg}
              startIcon={<UploadIcon />}
              sx={{ marginBottom: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}
            >
              Upload Img
            </Button>
          </Box>
          {dataAvailable && (
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
              <ResponsiveTypography>Prediction: {prediction}</ResponsiveTypography>
              <ResponsiveTypography>Allergen: {allergen}</ResponsiveTypography>
              <ResponsiveTypography>Description: {description}</ResponsiveTypography>
            </Box>
          )}
        </Grid>
        {dataAvailable && (
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ width: '100%', marginTop: 2 }}>
                <ResponsiveTypography>Confidence Levels:</ResponsiveTypography>
                <TableContainer sx={{ maxHeight: 700 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>#</StyledTableCell>
                        <StyledTableCell>Class</StyledTableCell>
                        <StyledTableCell>Confidence</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {confidence.map(([label, confidenceValue], index) => (
                        <TableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{label}</StyledTableCell>
                          <StyledTableCell>{confidenceValue}</StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
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

