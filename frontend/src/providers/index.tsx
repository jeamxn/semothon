"use client";

import React from "react";

import ColorProvider from "./ColorProvider";
import GoogleOauthProvider from "./GoogleOauthProvider";
import ReactQueryProvider from "./ReactQueryProvider";

const Providers = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <ReactQueryProvider>
      <GoogleOauthProvider>
        <ColorProvider>
          {children}
        </ColorProvider>
      </GoogleOauthProvider>
    </ReactQueryProvider>
  );
};

export default Providers;
