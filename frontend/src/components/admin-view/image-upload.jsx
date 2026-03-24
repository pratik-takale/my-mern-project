import { UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
}) {
  const inputRef = useRef(null);

  // ✅ HANDLE FILE SELECT
  function handleImageFileChange(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setImageFile(files);
    }
  }

  // ✅ DRAG
  function handleDragOver(event) {
    event.preventDefault();
  }

  // ✅ DROP
  function handleDrop(event) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      setImageFile(files);
    }
  }

  // ✅ REMOVE IMAGE
  function handleRemoveImage() {
    setImageFile([]);
    setUploadedImageUrl([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  // ✅ UPLOAD MULTIPLE IMAGES (SINGLE REQUEST)
  async function uploadImageToCloudinary() {
    if (!imageFile || imageFile.length === 0) return;

    setImageLoadingState(true);

    try {
      const data = new FormData();

      // 👉 append all files in one request
      imageFile.forEach((file) => {
        data.append("my_file", file);
      });

      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.images); // ✅ array
      }

    } catch (err) {
      console.error("Cloudinary upload failed:", err);
    } finally {
      setImageLoadingState(false);
    }
  }

  // ✅ AUTO UPLOAD
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  return (
    <div className="w-full mt-4 max-w-md mx-auto">
      <Label className="text-lg font-semibold mb-2 block">
        Upload Images
      </Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-4 ${
          isEditMode ? "opacity-60" : ""
        }`}
      >
        <Input
          id="image-upload"
          type="file"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {/* ✅ IMAGE PREVIEW */}
        {uploadedImageUrl && uploadedImageUrl.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {uploadedImageUrl.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="uploaded"
                className="w-full h-24 object-cover rounded"
              />
            ))}

            {/* REMOVE BUTTON */}
            {!isEditMode && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/60 text-white hover:bg-black"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : imageLoadingState ? (
          <Skeleton className="h-32 bg-gray-100" />
        ) : (
          <Label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center h-32 cursor-pointer ${
              isEditMode ? "cursor-not-allowed" : ""
            }`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload images</span>
          </Label>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;