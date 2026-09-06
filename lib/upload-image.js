export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/uploads/image', { method: 'POST', body: formData });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to upload image.');
  }

  return result.data;
}
