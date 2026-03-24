import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  images: [],
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState([]); // ✅ FIX
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // ✅ Sync uploaded images to formData
  useEffect(() => {
    if (uploadedImageUrl?.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: uploadedImageUrl,
      }));
    }
  }, [uploadedImageUrl]);

  // ✅ LOAD images in edit mode
  useEffect(() => {
    if (currentEditedId !== null && formData?.images) {
      setUploadedImageUrl(formData.images);
    }
  }, [currentEditedId]);

  // ✅ SUBMIT
  async function onSubmit(event) {
    event.preventDefault();

    try {
      const finalFormData = {
        ...formData,
        images: uploadedImageUrl,
      };

      if (currentEditedId !== null) {
        const data = await dispatch(
          editProduct({ id: currentEditedId, formData: finalFormData })
        );
        if (data?.payload?.success) {
          toast({ title: "Product updated successfully" });
        }
      } else {
        const data = await dispatch(addNewProduct(finalFormData));
        if (data?.payload?.success) {
          toast({ title: "Product added successfully" });
        }
      }

      dispatch(fetchAllProducts());
      setFormData(initialFormData);
      setImageFile(null);
      setUploadedImageUrl([]);
      setOpenCreateProductsDialog(false);
      setCurrentEditedId(null);
    } catch (error) {
      console.error(error);
    }
  }

  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  // ✅ VALIDATION FIX
  function isFormValid() {
    return (
      formData.images.length > 0 &&
      formData.title &&
      formData.description &&
      formData.category &&
      formData.brand &&
      formData.price &&
      formData.totalStock
    );
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList?.map((productItem) => (
          <AdminProductTile
            key={productItem._id}
            setFormData={setFormData}
            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
            setCurrentEditedId={setCurrentEditedId}
            product={productItem}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrl([]);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={false} // ✅ allow editing images
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