import { CldImage, getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp } from "lucide-react";
import dayjs from "dayjs";
import { filesize } from "filesize";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCallback, useEffect,useState } from "react";

dayjs.extend(relativeTime);

function VideoCard({ video, onDownload }) {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      quality: "auto",
      format: "jpg",
      assetType: "video",
    });
  }, []);

  const getPreviewVideoUrl = useCallback((publicId) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, []);

  const formatSize = useCallback((size) => {
    return filesize(size);
  }, []);

  const formatDuartion = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  // const compressionPercentage = Math.round(
  //   (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  // );

  useEffect(() => {
    setPreviewError(false);
    console.log(video)
  }, [isHovered])
  
  const handlePreviewError = () => {
    setPreviewError(true)
  }

  return (
    <>
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure>
          <video
            src={getPreviewVideoUrl(video.publicId)}
            autoPlay
            loop
            muted
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoCard;
