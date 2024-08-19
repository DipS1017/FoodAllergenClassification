import React, { useState, useRef, useCallback, useEffect } from "react";
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
  Input,
  ButtonGroup,
} from "@mui/material";
import {
  StyledTableCell,
  ResponsiveTypography,
} from "../../components/Theme/StyledComponents";
import { useLocation, Link } from "react-router-dom"; // Import Link for routing

const CapturedPicture: React.FC = () => {
  const location = useLocation();
  const image = location.state?.image as string;

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [prediction, setPrediction] = useState("");
  const [allergen, setAllergen] = useState("");
  const [description, setDescription] = useState("");
  const [confidence, setConfidence] = useState<Array<[string, string]>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (image) {
      // Process the image from the route state
      const dataURL = image; // Assuming image is already a data URL
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
      setImageSrc(image);
    }
  }, [image]);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        processImage(event.target.files[0]);
      }
    },
    [],
  );

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processImage(event.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataURL = reader.result as string;
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
      setImageSrc(dataURL);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <ResponsiveTypography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", color: "#454B1B" }}
      >
        Captured Image Analysis
      </ResponsiveTypography>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={10} md={6}>
          <Box sx={{ textAlign: "center" }}>
            <Input
              type="file"
              inputRef={fileInputRef}
              onChange={handleImageUpload}
              sx={{ display: "none" }}
            />
            <ButtonGroup variant="contained" aria-label="Basic button group">
              {" "}
              <Button
                onClick={() => fileInputRef.current?.click()}
                color="primary"
              >
                Upload Image
              </Button>

              <Link to="/realtime-camera" style={{ textDecoration: "none" }} >
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginLeft: 2 }}
                >
                  Use Real-Time Camera
                </Button>
              </Link>
            </ButtonGroup>
            <Box
              ref={dropZoneRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: "2px dashed #cccccc",
                borderRadius: 2,
                padding: 2,
                marginY: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                backgroundColor: "#f9f9f9",
                textAlign: "center",
              }}
            >
              {!imageSrc ? (
                <Typography variant="h6" color="textSecondary">
                  Drag an image here or click the button to upload
                </Typography>
              ) : (
                <img
                  src={imageSrc}
                  alt="Captured"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                  }}
                />
              )}
            </Box>
            {imageSrc && (
              <>
                <ResponsiveTypography sx={{ marginTop: 2 }}>
                  Prediction: {prediction}
                </ResponsiveTypography>
                <ResponsiveTypography>
                  Allergen: {allergen}
                </ResponsiveTypography>
                <ResponsiveTypography>
                  Description: {description}
                </ResponsiveTypography>
              </>
            )}
          </Box>
        </Grid>
        {imageSrc && (
          <Grid item xs={12} sm={12} md={6}>
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
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CapturedPicture;
