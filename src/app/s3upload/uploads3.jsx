export const uploadToS3 = async (file, folder) => {
  try {
    const res = await fetch(`/api/s3-upload?file=${file.name}&folder=${folder}`);

    if (!res.ok) {
      throw new Error(`Failed to get upload URL: ${res.status} ${res.statusText}`);
    }

    const { uploadURL, key } = await res.json();

    console.log('Presigned URL:', uploadURL); // Inspect the URL

    const putRes = await fetch(uploadURL, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!putRes.ok) {
      throw new Error(`Failed to upload to S3: ${putRes.status} ${putRes.statusText}`);
    }

    const fileUrl = `https://your-s3-bucket-name.s3.amazonaws.com/${key}`; //replace your-s3-bucket-name
    return fileUrl;
  } catch (error) {
    console.error('Error during S3 upload:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};