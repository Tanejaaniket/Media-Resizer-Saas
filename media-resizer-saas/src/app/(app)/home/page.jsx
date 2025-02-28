"use client";
import VideoCard from "@/components/VideoCard";
import axios from "axios";
import { Fragment, useCallback, useEffect, useState } from "react";

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/video");
      if (Array.isArray(res.data)) {
        setVideos(res.data);
      } else {
        console.log("Error fetching videos");
        return;
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDownload = useCallback((url, title) => {
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("target", `_blank`);
    a.download = `${title}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl text-center my-5">Videos</h1>
      <div className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <h1>Loading...</h1>}
        {videos.map((video) => (
          <Fragment key={video.publicId}>
            <VideoCard video={video} onDownload={handleDownload} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
