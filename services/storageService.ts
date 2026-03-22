import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export async function uploadImage(file: File, folder: string): Promise<string> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${filename}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Return just the path (not the download URL which expires)
    // Format: "foldername/timestamp_filename"
    return `${folder}/${filename}`;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getImageUrl(storagePath: string): Promise<string> {
  try {
    if (!storagePath) return '';

    // If it's already a full URL (starts with http), return as-is
    if (storagePath.startsWith('http')) {
      return storagePath;
    }

    // Otherwise treat it as a storage path and get fresh download URL
    const storageRef = ref(storage, storagePath);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Failed to get image URL:', error);
    // If we can't get the URL, return the path as-is (might be external URL)
    return storagePath;
  }
}

export async function deleteImage(imagePath: string): Promise<void> {
  try {
    if (!imagePath) return;

    // If it's already a full URL, extract the path from it
    let pathToDelete = imagePath;
    if (imagePath.startsWith('http')) {
      const decodedUrl = decodeURIComponent(imagePath);
      const startIndex = decodedUrl.indexOf('/o/') + 3;
      const endIndex = decodedUrl.indexOf('?');
      pathToDelete = decodedUrl.substring(startIndex, endIndex);
    }

    const imageRef = ref(storage, pathToDelete);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Image deletion failed:', error);
    // Don't throw - some paths might be external or already deleted
  }
}

export async function uploadPastorImage(file: File): Promise<string> {
  return uploadImage(file, 'pastors');
}

export async function uploadSermonImage(file: File): Promise<string> {
  return uploadImage(file, 'sermons');
}

export async function uploadEventImage(file: File): Promise<string> {
  return uploadImage(file, 'events');
}

export async function uploadMinistryImage(file: File): Promise<string> {
  return uploadImage(file, 'ministries');
}
