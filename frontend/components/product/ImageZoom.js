"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageZoom({ src, alt }) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-2xl border border-border"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition duration-300 ${zoomed ? "scale-110" : "scale-100"}`}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
