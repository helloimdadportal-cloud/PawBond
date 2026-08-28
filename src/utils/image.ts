/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Compresses an image file down to a max dimension + JPEG quality before
 * it gets stored as a base64 string in localStorage.
 *
 * Raw phone photos can be 3-8MB each. Base64-encoding inflates that by ~33%,
 * and localStorage is typically capped around 5-10MB per origin. Without
 * compression, a handful of photos can silently blow the quota and every
 * future save just fails quietly. Resizing to a reasonable display size
 * (long edge ~1280px) and re-encoding as JPEG at ~0.75 quality gets a
 * typical photo down to well under 300KB while still looking great on a
 * phone screen.
 */
export const MAX_IMAGE_DIMENSION = 1280;
export const IMAGE_QUALITY = 0.75;

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageProcessingError';
  }
}

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new ImageProcessingError('Could not read the selected file.'));
      }
    };
    reader.onerror = () => reject(new ImageProcessingError('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
};

const loadImage = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ImageProcessingError('That file does not look like a valid image.'));
    img.src = dataUrl;
  });
};

/**
 * Reads an uploaded image file, downscales it if needed, and returns a
 * compressed JPEG data URL suitable for localStorage.
 */
export const compressImageFile = async (
  file: File,
  maxDimension: number = MAX_IMAGE_DIMENSION,
  quality: number = IMAGE_QUALITY
): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    throw new ImageProcessingError('Please choose an image file (JPG, PNG, etc).');
  }

  const rawDataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(rawDataUrl);

  let { width, height } = img;
  if (width > maxDimension || height > maxDimension) {
    if (width >= height) {
      height = Math.round((height / width) * maxDimension);
      width = maxDimension;
    } else {
      width = Math.round((width / height) * maxDimension);
      height = maxDimension;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Canvas unsupported for some reason - fall back to the original image
    // rather than blocking the user from saving their memory at all.
    return rawDataUrl;
  }

  ctx.drawImage(img, 0, 0, width, height);

  try {
    return canvas.toDataURL('image/jpeg', quality);
  } catch {
    // toDataURL can throw on tainted canvases; fall back to original.
    return rawDataUrl;
  }
};

/** Rough estimate of how many bytes a base64 data URL represents. */
export const estimateBase64Bytes = (dataUrl: string): number => {
  const base64 = dataUrl.split(',')[1] || '';
  return Math.round((base64.length * 3) / 4);
};
