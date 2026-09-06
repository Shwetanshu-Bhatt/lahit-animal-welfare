export async function uploadImage(file) {
  const signatureResponse = await fetch('/api/uploads/image', { method: 'POST' });
  const signatureResult = await signatureResponse.json();
  if (!signatureResponse.ok || !signatureResult.success) {
    throw new Error(signatureResult.error || 'Could not authorize image upload.');
  }

  const { cloudName, apiKey, folder, timestamp, signature } = signatureResult.data;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('folder', folder);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok || !result.secure_url) {
      throw new Error(result.error?.message || 'Failed to upload image.');
    }

    return { url: result.secure_url, filename: file.name };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Image upload timed out. Please check your connection and try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
