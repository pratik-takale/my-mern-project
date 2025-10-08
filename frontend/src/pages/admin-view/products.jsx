
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Sync uploaded image URL to formData.image
  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({ ...prev, image: uploadedImageUrl }));
    }
  }, [uploadedImageUrl]);

  // ✅ Submit handler for add/edit product
  async function onSubmit(event) {
    event.preventDefault();

    try {
      let finalImageUrl = uploadedImageUrl;

      // 1️⃣ Upload new image if selected
      if (imageFile) {
        setImageLoadingState(true);
        const formDataImage = new FormData();
        formDataImage.append("my_file", imageFile); // match backend field name

        const uploadRes = await fetch("http://localhost:5000/api/admin/products/upload-image", {
          method: "POST",
          body: formDataImage,
        });

        const uploadData = await uploadRes.json();
        setImageLoadingState(false);

        if (uploadData?.success) {
          finalImageUrl = uploadData.result.secure_url;
          setUploadedImageUrl(finalImageUrl);
        } else {
          toast({ title: "Image upload failed!", variant: "destructive" });
          return;
        }
      }

      // 2️⃣ Prepare final product data
      const finalFormData = { ...formData, image: finalImageUrl };

      // 3️⃣ Call add / edit API
      if (currentEditedId !== null) {
        const data = await dispatch(editProduct({ id: currentEditedId, formData: finalFormData }));
        if (data?.payload?.success) toast({ title: "Product updated successfully" });
      } else {
        const data = await dispatch(addNewProduct(finalFormData));
        if (data?.payload?.success) toast({ title: "Product added successfully" });
      }

      // 4️⃣ Reset states & refresh list
      dispatch(fetchAllProducts());
      setFormData(initialFormData);
      setImageFile(null);
      setUploadedImageUrl("");
      setOpenCreateProductsDialog(false);
      setCurrentEditedId(null);
    } catch (error) {
      console.error("Submit error:", error);
      toast({ title: "Something went wrong!", variant: "destructive" });
    }
  }

  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) dispatch(fetchAllProducts());
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((key) => key !== "averageReview")
      .every((key) => formData[key] !== "");
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0 &&
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDelete}
            />
          ))
        }
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
