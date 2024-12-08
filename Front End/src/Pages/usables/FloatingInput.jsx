import React, { useState } from "react";
import "../../Styles/FloatingInput.css";

const FloatingInput = ({ label, type = "text", ...props }) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    // Only blur if input is empty and unfocused
    if (value === "") setFocused(false);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  // The label should be active if there's any text or input is focused
  const isActive = focused || value.length > 0;

  return (
    <div className={`floating-input-container ${isActive ? "active" : ""}`}>
      <label className={`floating-label ${isActive ? "active" : ""}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className="floating-input"
        {...props}
      />
    </div>
  );
};

export default FloatingInput;
