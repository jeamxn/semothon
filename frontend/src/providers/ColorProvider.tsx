"use client";

import React from "react";

const ColorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  React.useEffect(() => {
    const root = document.documentElement;
    const updateDarkFromKey = () => {
      const key = getComputedStyle(root).getPropertyValue("--key").trim();
      const [r, g, b] = key.split(" ").map(Number);
      const darkR = Math.max(0, Math.floor(r * 0.42));
      const darkG = Math.max(0, Math.floor(g * 0.42));
      const darkB = Math.max(0, Math.floor(b * 0.42));
      root.style.setProperty("--dark", `${darkR} ${darkG} ${darkB}`);
    };

    const observer = new MutationObserver(() => {
      updateDarkFromKey();
    });
    updateDarkFromKey();

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["style"],
      subtree: false,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return children;
};

export default ColorProvider;