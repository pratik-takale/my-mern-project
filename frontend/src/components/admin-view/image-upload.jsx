
// import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { useEffect, useRef } from "react";
// import { Button } from "../ui/button";
// import axios from "axios";
// import { Skeleton } from "../ui/skeleton";

// function ProductImageUpload({
//   imageFile,
//   setImageFile,
//   imageLoadingState,
//   uploadedImageUrl,
//   setUploadedImageUrl,
//   setImageLoadingState,
//   isEditMode,
// }) {
//   const inputRef = useRef(null);

//   function handleImageFileChange(event) {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) setImageFile(selectedFile);
//   }

//   function handleDragOver(event) {
//     event.preventDefault();
//   }

//   function handleDrop(event) {
//     event.preventDefault();
//     const droppedFile = event.dataTransfer.files?.[0];
//     if (droppedFile) setImageFile(droppedFile);
//   }

//   function handleRemoveImage() {
//     setImageFile(null);
//     setUploadedImageUrl("");
//     if (inputRef.current) inputRef.current.value = "";
//   }

//   async function uploadImageToCloudinary() {
//     if (!imageFile) return;
//     setImageLoadingState(true);
//     const data = new FormData();
//     data.append("my_file", imageFile);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/admin/products/upload-image",
//         data
//       );

//       if (response?.data?.success) {
//         setUploadedImageUrl(response.data.result.secure_url); // <-- must use secure_url
//       }
//     } catch (err) {
//       console.error("Cloudinary upload failed:", err);
//     } finally {
//       setImageLoadingState(false);
//     }
//   }

//   useEffect(() => {
//     if (imageFile) uploadImageToCloudinary();
//   }, [imageFile]);

//   return (
//     <div className="w-full mt-4 max-w-md mx-auto">
//       <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
//       <div
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}
//       >
//         <Input
//           id="image-upload"
//           type="file"
//           className="hidden"
//           ref={inputRef}
//           onChange={handleImageFileChange}
//           disabled={isEditMode}
//         />
//         {!imageFile ? (
//           <Label
//             htmlFor="image-upload"
//             className={`${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 cursor-pointer`}
//           >
//             <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
//             <span>Drag & drop or click to upload image</span>
//           </Label>
//         ) : imageLoadingState ? (
//           <Skeleton className="h-10 bg-gray-100" />
//         ) : (
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <FileIcon className="w-8 text-primary mr-2 h-8" />
//             </div>
//             <p className="text-sm font-medium">{imageFile.name}</p>
//             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleRemoveImage}>
//               <XIcon className="w-4 h-4" />
//               <span className="sr-only">Remove File</span>
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductImageUpload;
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
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

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function uploadImageToCloudinary() {
    if (!imageFile) return;
    setImageLoadingState(true);

    const data = new FormData();
    data.append("my_file", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );

      if (response?.data?.success && response?.data?.url) {
        setUploadedImageUrl(response.data.url); // ✅ use url, not result.secure_url
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className="w-full mt-4 max-w-md mx-auto">
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {/* Show Uploaded Image Preview */}
        {uploadedImageUrl ? (
          <div className="relative">
            <img
              src={uploadedImageUrl}
              alt="Uploaded Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
            {!isEditMode && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : !imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
