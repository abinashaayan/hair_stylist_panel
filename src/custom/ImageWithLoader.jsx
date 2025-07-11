import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";

const ImageWithLoader = ({ src, alt }) => {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 6,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: loaded ? "transparent" : "rgba(0,0,0,0.05)",
      }}
    >
      {!loaded && (
        <CircularProgress
          size={20}
          thickness={5}
          sx={{
            position: "absolute",
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 6,
          display: loaded ? "block" : "none",
        }}
      />
    </Box>
  );
};

export default ImageWithLoader;
