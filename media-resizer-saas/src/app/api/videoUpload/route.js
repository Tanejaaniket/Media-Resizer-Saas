import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/dist/types/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});


async function POST(request) {
  const { userId } = await auth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file")
    const title = formData.get("title")
    const description = formData.get("description")
    const originalSize = formData.get("orignalSize")

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "media-resizer-saas",
          resource_type: "video",
          transformation: [
            {quality: "auto", fetch_format: "mp4"},
          ]
         },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
      uploadStream.end(buffer)
    })
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        originalSize,
        compressedSize: String(result.bytes),
        duration:result.duration || 0
      }
    })

    return NextResponse.json(video,{ status: 200 });
  } catch (error) { 
    console.log(error)
    return NextResponse.json({ error: "Error uploading video" }, { status: 500 });
  }


}
