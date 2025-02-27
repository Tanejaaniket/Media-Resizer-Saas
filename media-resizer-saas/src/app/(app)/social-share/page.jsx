"use client";
import { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import axios from "axios";
import toast from "react-hot-toast";

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
  "Tweeter Header (3:1)": {
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
  const [selectedFormat, setSelectedFormat] = useState("Instagram Square (1:1)");
  const [isUploading, setisUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if(uploadedImage){
      setIsTransforming(true)
    }
  },[selectedFormat,uploadedImage])

  const handleFileUpload = async (event) => {
    const file = event.target?.files?.[0];
    if (!file) return;
    setisUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post('/api/imageUpload', formData);
      setUploadedImage(res?.publicId);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error?.error || "Error uploading image");
      console.log(error)
    } finally {
      setisUploading(false);
    }
  }

  const handleDownload = async () => { 
    if (!imgRef.current) return;
    fetch(imgRef.current.src)
      .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedFormat.replace(/\s+/g,"_").toLowerCase()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a) 
      window.URL.revokeObjectURL(url) 
    })
  }

  return <>Social share</>;
}

export default SocialSharePage;
