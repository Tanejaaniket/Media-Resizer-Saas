import { CldImage, getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import {
  Download,
  Clock,
  FileDown,
  FileUp,
  DownloadIcon,
  FileText,
} from "lucide-react";
import dayjs from "dayjs";
import { filesize } from "filesize";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCallback, useEffect, useState } from "react";

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

  const formatDuartion = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  const getRelativeTime = (uploadingDate) => {
    const createdDate = new Date(uploadingDate);
    const diff = Date.now() - createdDate;
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <>
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? (
            previewError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-red-500">Preview not available</p>
              </div>
            ) : (
              <video
                src={getPreviewVideoUrl(video.publicId)}
                autoPlay
                loop
                muted
                onError={handlePreviewError}
              />
            )
          ) : (
            <div>
              <img src={getThumbnailUrl(video.publicId)} />
              <div className="absolute right-2 top-[40%] bg-base-100 bg-opacity-70 px-2 py-1 rounded-lg text-sm flex items-center">
                <Clock size={16} className="mr-1" />
                {formatDuartion(video.duration)}
              </div>
            </div>
          )}
        </figure>
        <div className="card-body">
          <h2 className="card-title py-2">{video.title}</h2>
          <div className="flex pb-2">
            <p>
              <FileText className="inline" /> {formatSize(video.compressedSize)}
            </p>
            <p className="text-green-400">
              <FileDown className="inline" /> {`${compressionPercentage} %`}
            </p>
          </div>
          <p className="text-slate-400">
            Uploaded: {getRelativeTime(video.createdAt)} days ago
          </p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                onDownload(getFullVideoUrl(video.publicId, video.title));
              }}
            >
              <DownloadIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoCard;
