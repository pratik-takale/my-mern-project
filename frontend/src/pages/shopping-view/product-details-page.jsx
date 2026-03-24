import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { Button } from "@/components/ui/button";
import { getReviews, addReview } from "@/store/shop/review-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useNavigate } from "react-router-dom";
function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { productDetails, isLoading } = useSelector(
    (state) => state.shopProducts || {}
  );

  const { reviews } = useSelector((state) => state.shopReview || {});

  const [rating, setRating] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
      dispatch(getReviews(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (productDetails?.images?.length > 0) {
      setSelectedImage(productDetails.images[0]);
    }
  }, [productDetails]);

  function handleAddReview() {
    dispatch(
      addReview({
        productId: id,
        rating: Number(rating),
      })
    ).then(() => {
      dispatch(getReviews(id));
      setRating(1);
    });
  }
function handleAddtoCart() {
  if (!user?.id) {
    alert("Please login first");
    return;
  }

  // ✅ STOCK CHECK (इथे add कर)
  if (qty > productDetails.totalStock) {
    alert("Out of stock limit");
    return;
  }

  dispatch(
    addToCart({
      userId: user.id,
      productId: productDetails._id,
      quantity: qty,
    })
  ).then((res) => {
    if (res?.payload?.success) {
      dispatch(fetchCartItems(user.id));
    }
  });
}
async function handleBuyNow() {
  if (!user?.id) {
    alert("Please login first");
    return;
  }

  if (qty > productDetails.totalStock) {
    alert("Out of stock limit");
    return;
  }

  const res = await dispatch(
    addToCart({
      userId: user.id,
      productId: productDetails._id,
      quantity: qty,
    })
  );

  if (res?.payload?.success) {
    navigate("/shop/checkout"); // ✅ DIRECT CHECKOUT
  }
}
  if (isLoading) return <h1 className="p-6">Loading...</h1>;
  if (!productDetails) return <h1 className="p-6">No Product Found</h1>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* ✅ GRID FIX (IMPORTANT) */}
      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* LEFT - IMAGE */}
        <div className="w-full flex flex-col items-center">

          <div className="bg-white rounded-xl shadow w-full h-[420px] flex items-center justify-center overflow-hidden">
            <img
              src={selectedImage || "https://via.placeholder.com/400"}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-5 flex-wrap justify-center">
            {productDetails.images?.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`p-[2px] rounded-lg cursor-pointer ${
                  selectedImage === img
                    ? "border-2 border-pink-500"
                    : "border border-gray-200"
                }`}
              >
                <img
                  src={img}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - DETAILS */}
        <div className="space-y-5">

          <h1 className="text-3xl font-bold">
            {productDetails.title}
          </h1>

          <p className="text-gray-500">
            {productDetails.description}
          </p>

          {/* ⭐ RATING */}
          <div className="flex items-center gap-2">
            <div className="text-yellow-500 text-lg">
              {"★".repeat(5)}
            </div>
            <span className="text-gray-500 text-sm">
              ({reviews?.length || 0} ratings)
            </span>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-green-600">
              ₹{productDetails.salePrice || productDetails.price}
            </span>

            {productDetails.salePrice && (
              <span className="line-through text-gray-400">
                ₹{productDetails.price}
              </span>
            )}
          </div>

          {/* STOCK */}
          <p className="text-green-600 text-sm">
            {productDetails.totalStock > 0
              ? `In Stock (${productDetails.totalStock})`
              : "Out of Stock"}
          </p>

          {/* QUANTITY */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 border rounded"
            >
              -
            </button>

            <span>{qty}</span>

            <button
              onClick={() => setQty((prev) => prev + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <Button onClick={handleAddtoCart} className="flex-1">
  Add to Cart
</Button>
           <Button onClick={handleBuyNow} variant="outline" className="flex-1">
  Buy Now
</Button>
          </div>

          {/* FEATURES */}
          <div className="text-sm text-gray-600 space-y-2">
            <p>✔ Free Delivery</p>
            <p>✔ 7 Days Replacement</p>
            <p>✔ Secure Payment</p>
          </div>

          {/* ⭐ GIVE RATING */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Give Rating</h3>

            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  onClick={() => setRating(num)}
                  className={`cursor-pointer text-2xl ${
                    rating >= num ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <Button onClick={handleAddReview}>
              Submit Rating
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;