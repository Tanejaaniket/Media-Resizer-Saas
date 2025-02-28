"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

function VideoUploadPage() {

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("No file selected");
      return
    };
    if(file.size > MAX_FILE_SIZE){
      toast.error("File size is too large");
      return
    }
console.log(file)
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file?.size);
    try {
      const res = await axios.post('/api/videoUpload', formData);
      toast.success("Video uploaded successfully");
      router.push(`/home`);
    } catch (error) {
      toast.error(error?.error || "Error uploading video");
      console.log(error)
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 justify-items-center min-h-screen py-6">
        <div className="w-1/2">
          <h1 className="text-4xl text-center py-7">Upload your video</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full block mb-5"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered block w-full mb-5"
            ></textarea>

            <input
              type="file"
              className="file-input file-input-bordered file-input-info block w-full"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              type="submit"
              className="btn btn-primary w-full mt-5"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default VideoUploadPage;