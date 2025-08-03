import React from "react";

const Spinner = ({ size = 40, color = "#4f46e5" }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full border-4 border-solid border-current border-t-transparent"
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderTopColor: "transparent",
        }}
      ></div>
    </div>
  );
};

export default Spinner;
