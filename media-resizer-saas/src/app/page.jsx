"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h1 className="text-6xl my-5 text-center">Welcome to Media Resizer</h1>
        <p className="text-2xl my-5">
          Resize and compress videos in seconds and also crop images for social
          media
        </p>
        <div className="text-center">
          <p className="text-2xl text-center my-4">Try it out now!</p>
          <button className="btn btn-outline px-6" onClick={
            () => router.push("/home")
          }>Let's go</button>
        </div>
      </div>
    </div>
  );
}
