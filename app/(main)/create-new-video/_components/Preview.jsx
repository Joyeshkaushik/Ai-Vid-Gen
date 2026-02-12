import React from "react";
import Image from "next/image";
import { options } from "./VideoStyle";

function Preview({ formData }) {
  if (!formData?.videoStyle) return null;

  const selectVideoStyle = options.find(
    (item) =>
      item.name.trim().toLowerCase() ===
      formData.videoStyle.trim().toLowerCase()
  );

  if (!selectVideoStyle) return null;

  return (
    <div className="w-full relative">
        <h2 className="mb-3 text-2xl">Preview</h2>
      <Image
        src={selectVideoStyle.image}
        alt={selectVideoStyle.name}
        width={1000}
        height={300}
        className="w-full h-[70vh] object-cover rounded-xl"
      />
      <h2  className={`${formData?.caption?.style} absolute bottom-7 text-center w-full`}>{formData?.caption?.name}</h2>
    </div>
  );
}

export default Preview;
