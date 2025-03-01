"use client";
import { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const socialFormats = {
  "Instagram Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "Instagram Potrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },
  "Facebook Cover (205:78)": {
    width: 820,
    height: 312,
    aspectRatio: "205:78",
  },
};
function SocialSharePage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(
    "Instagram Square (1:1)"
  );
  const [isUploading, setisUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) return;
    setisUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/imageUpload", formData);
      console.log(res);
      setUploadedImage(res.data?.publicId);
      toast.success("Image uploaded successfully");
      setFile(null);
    } catch (error) {
      toast.error(error?.error || "Error uploading image");
      console.log(error);
    } finally {
      setisUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imgRef.current) return;
    fetch(imgRef.current.src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-4xl text-center py-5 mb-10">Upload image</h1>
      <form onSubmit={handleFileUpload}>
        <div className="flex justify-center pb-5">
          <input
            type="file"
            className="file-input file-input-primary w-1/2"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="flex justify-center pb-5 mb-[50px]">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isUploading}
          >
            {isUploading ? "Uploading.." : "Upload"}
          </button>
        </div>
      </form>
      <div className="flex justify-center mb-6">
        <select
          defaultValue={"Instagram Square (1:1)"}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="select w-1/2"
        >
          <option>{"Instagram Square (1:1)"}</option>
          <option>{"Facebook Cover (205:78)"}</option>
          <option>{"Instagram Potrait (4:5)"}</option>
          <option>{"Twitter Header (3:1)"}</option>
          <option>{"Twitter Post (16:9)"}</option>
        </select>
      </div>
      {uploadedImage && (
        <div>
          <div className="flex justify-center mb-[15px]">
            <CldImage
              src={uploadedImage}
              height={socialFormats[selectedFormat].height}
              width={socialFormats[selectedFormat].width}
              gravity="auto"
              sizes="100vw"
              crop={"fill"}
              aspectRatio={socialFormats[selectedFormat].aspectRatio}
              ref={imgRef}
              onLoad={() => setIsTransforming(false)}
              alt="Transformed Image"
            />
          </div>
          <div className="flex justify-center">
            <button className="btn btn-primary" onClick={handleDownload}>
              Download image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SocialSharePage;
