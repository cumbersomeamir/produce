"use client";

import { useEffect } from "react";

export default function TrackRecentlyViewed({ productId }) {
  useEffect(() => {
    const raw = localStorage.getItem("oddfinds-recent") || "[]";
    const ids = JSON.parse(raw).filter((id) => id !== productId);
    ids.unshift(productId);
    localStorage.setItem("oddfinds-recent", JSON.stringify(ids.slice(0, 10)));
  }, [productId]);

  return null;
}
