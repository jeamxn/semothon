"use client";

import React from "react";

const SetColor = ({
  color
}: {
    color: string;
  }) => {
  React.useLayoutEffect(() => {
    document.documentElement.style.setProperty("--key", color);
    return () => {
      document.documentElement.style.setProperty("--key", "var(--origin)");
    };
  }, [color]);
  return null;
};
export default SetColor;
