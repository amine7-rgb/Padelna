const MAX_AVATAR_DATA_URL_LENGTH = 320000;

const loadImageFromFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Unable to read this image file."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Unable to process this image."));
      image.onload = () => resolve(image);
      image.src = String(reader.result || "");
    };

    reader.readAsDataURL(file);
  });

export const prepareAvatarDataUrl = async (file) => {
  if (!file) {
    return "";
  }

  if (!String(file.type || "").startsWith("image/")) {
    throw new Error("Please choose a valid image file.");
  }

  const image = await loadImageFromFile(file);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Image processing is not available in this browser.");
  }

  const side = 320;
  const cropSize = Math.min(image.width, image.height);
  const offsetX = (image.width - cropSize) / 2;
  const offsetY = (image.height - cropSize) / 2;

  canvas.width = side;
  canvas.height = side;
  context.drawImage(image, offsetX, offsetY, cropSize, cropSize, 0, 0, side, side);

  const qualities = [0.86, 0.78, 0.7, 0.62];

  for (const quality of qualities) {
    const dataUrl = canvas.toDataURL("image/jpeg", quality);

    if (dataUrl.length <= MAX_AVATAR_DATA_URL_LENGTH) {
      return dataUrl;
    }
  }

  throw new Error("This image is too large. Choose a lighter photo.");
};
