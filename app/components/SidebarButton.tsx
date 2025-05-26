import Button from "@mui/material/Button";
import React from "react";

function SidebarButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      onClick={onClick}
      sx={{
        fontSize: 20,
        py: 2,
        borderRadius: 3,
        background:
          "linear-gradient(90deg,rgb(195, 163, 104) 0%,rgb(171, 152, 83) 50%)",
        color: "black",
        fontWeight: 700,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        mb: 1.5,
        transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
        "&:hover": {
          background:
            "linear-gradient(90deg,rgb(137, 118, 46) 0%, #f7c873 100%)",
          color: "black",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        },
      }}
    >
      {label}
    </Button>
  );
}

export default SidebarButton;
