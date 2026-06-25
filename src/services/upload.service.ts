import cloudinary from "@/lib/cloudinary";

export async function uploadAvatarToCloudinary(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "pulse-monitor/avatars",
          resource_type: "image",
          transformation: [
            {
              width: 300,
              height: 300,
              crop: "fill",
              gravity: "face",
            },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
            return;
          }

          resolve(result.secure_url);
        },
      )
      .end(buffer);
  });
}
