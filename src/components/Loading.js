"use client";

import React from "react";

export default function ThickCircleLoader() {
  return (
    <div className="parentLoading">
      <div className="spinner">
        <div className="circle one"></div>
        <div className="circle two"></div>
        <div className="circle three"></div>
      </div>
    </div>
  );
}
