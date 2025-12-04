export const CLOUDINARY_UPLOAD_PRESET = "wisata_preset";
export const CLOUDINARY_CLOUD_NAME = "dbq6wgqls";

export const uploadToCloudinary = async (imageUri: string) => {
  const data = new FormData();

  data.append("file", {
    uri: imageUri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as any);

  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: data,
      }
    );

    const json = await res.json();
    console.log("CLOUDINARY RESPONSE:", json);

    return json.secure_url;
  } catch (err) {
    console.log("CLOUDINARY ERROR:", err);
    return null;
  }
};
