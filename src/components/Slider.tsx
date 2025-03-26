import React from "react";
import SliderMui from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";

type SliderProps = {
  value: number;
  onChange: (value: number) => void;
};

type ValueLabelProps = {
  value: number;
  open: boolean;
  children: React.ReactElement;
};

const tooltipStyles = {
  tooltip: {
    sx: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff",
      color: "#6a00ff",
      borderRadius: "8px",
      width: "50px",
      height: "35px",
      border: "2px solid #c2a5df",
      fontSize: "15px",
      cursor: "pointer",
    },
  },
  arrow: {
    sx: {
      color: "#ffffff",
      fontSize: "24px",
      "&::before": {
        border: "2px solid #c2a5df",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
      },
    },
  },
};

const ValueLabelComponent = ({ value, open, children }: ValueLabelProps) => (
  <Tooltip
    open={open}
    enterTouchDelay={0}
    placement="bottom"
    title={value}
    arrow
    slotProps={tooltipStyles}
  >
    {children}
  </Tooltip>
);

const Slider = ({ value, onChange }: SliderProps) => (
  <SliderMui
    value={value}
    min={8}
    max={100}
    step={1}
    onChange={(_, newValue) => onChange(newValue as number)}
    valueLabelDisplay="on"
    slots={{ valueLabel: ValueLabelComponent }}
    sx={{ color: "#761BE4", width: "100%" }}
  />
);

export default Slider;
