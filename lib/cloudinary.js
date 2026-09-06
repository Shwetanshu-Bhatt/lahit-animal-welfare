import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function configureCloudinary() {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary server credentials are not configured.');
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  configured = true;
}

export function uploadImageBuffer(buffer, options = {}) {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'lahit', ...options },
      (error, result) => error ? reject(error) : resolve(result)
    );
    stream.end(buffer);
  });
}

export async function uploadImageSource(source, options = {}) {
  configureCloudinary();
  return cloudinary.uploader.upload(source, {
    resource_type: 'image',
    folder: 'lahit',
    ...options,
  });
}
