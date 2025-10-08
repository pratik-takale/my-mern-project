import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useToast } from "../ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getReviews, addReview, clearReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  // Handle rating
  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  // Handle add to cart
  function handleAddToCart(productId, totalStock) {
    const items = cartItems.items || [];
    const existingIndex = items.findIndex((item) => item.productId === productId);

    if (existingIndex > -1 && items[existingIndex].quantity + 1 > totalStock) {
      toast({
        title: `Only ${items[existingIndex].quantity} quantity can be added for this item`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  // Handle add review
  function handleAddReview() {
    if (!reviewMsg.trim() || rating === 0) return;

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((res) => {
      if (res.payload?.success) {
        setReviewMsg("");
        setRating(0);
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully!" });
      }
    });
  }

  // Dialog close
  function handleDialogClose() {
    setOpen(false);
    dispatch(clearReviews());
    setReviewMsg("");
    setRating(0);
  }

  // Fetch reviews on product change
  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails, dispatch]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <DialogDescription className="sr-only">
          Product details and reviews for {productDetails?.title}
        </DialogDescription>

        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
          <p className="text-muted-foreground text-2xl mb-5 mt-4">
            {productDetails?.description}
          </p>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ₹{productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className="text-2xl font-bold text-muted-foreground">
                ₹{productDetails?.salePrice}
              </p>
            )}
          </div>

          {/* Average Rating */}
          <div className="flex items-center gap-2 mt-2">
            <StarRatingComponent rating={averageReview} />
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>

          {/* Add to Cart */}
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(productDetails?._id, productDetails?.totalStock)
                }
              >
                Add to Cart
              </Button>
            )}
          </div>

          <Separator />

          {/* Reviews Section */}
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {review?.userName?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{review.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={review.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">{review.reviewMessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Reviews</p>
              )}
            </div>

            {/* Add Review Form */}
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />
              <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ""}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
