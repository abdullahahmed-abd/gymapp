import { Text as RNText, StyleSheet } from "react-native";
import React from "react";

const defaultRender = RNText.render;

RNText.render = function (...args) {
  const origin = defaultRender.apply(this, args);

  let fontFamily = "Orbitron-Regular"; // default

  // Check if style contains fontWeight
  const weight = origin.props.style?.fontWeight || "400";

  switch (String(weight)) {
  case "700":
  case "bold":
    fontFamily = "Orbitron-Bold";
    break;
  case "600":
    fontFamily = "Orbitron-SemiBold";
    break;
  case "500":
    fontFamily = "Orbitron-Medium";
    break;
  default:
    fontFamily = "Orbitron-Regular";
}


  return React.cloneElement(origin, {
    style: [origin.props.style, { fontFamily }],
  });
};
