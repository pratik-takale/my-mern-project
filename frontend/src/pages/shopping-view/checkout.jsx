import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems?.items?.reduce(
      (sum, item) =>
        sum +
        (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
      0
    ) || 0;

  // Load Razorpay SDK
  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // Razorpay Payment
  const handleRazorpayPayment = async () => {
    try {
      if (!cartItems?.items?.length) {
        toast({ title: "Cart is empty", variant: "destructive" });
        return;
      }

      if (!currentSelectedAddress) {
        toast({ title: "Please select address", variant: "destructive" });
        return;
      }

      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const orderData = {
  userId: user?.id,
  cartId: cartItems?._id,
  cartItems: cartItems.items.map((item) => ({
    productId: item.productId,
    title: item.title,
    image: Array.isArray(item.image) ? item.image[0] : item.image,
    price: item.salePrice > 0 ? item.salePrice : item.price,
    quantity: item.quantity,
  })),
  addressInfo: currentSelectedAddress || {}, // 🔥 safety
  paymentMethod: "razorpay",
  totalAmount: Number(totalCartAmount), // 🔥 ensure number
};

      const res = await dispatch(createNewOrder(orderData)).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.amount,
        currency: "INR",
        name: "EliteTechShop",
        description: "Order Payment",
        order_id: res.razorpayOrderId,

        handler: async function (response) {
          try {
            console.log("Payment Success", response);

            // ✅ VERIFY PAYMENT (IMPORTANT)
            await fetch("http://localhost:5000/api/shop/order/capture", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...response,
                orderId: res.orderId,
              }),
            });

            toast({ title: "Payment Successful 🎉" });

            // OPTIONAL: redirect
            window.location.href = "/shop/payment-success";
          } catch (err) {
            console.error("Verify Error", err);
            toast({
              title: "Payment done but verification failed",
              variant: "destructive",
            });
          }
        },

        prefill: {
          name: user?.userName, // FIXED
          email: user?.email,
          contact: currentSelectedAddress?.phone,
        },

        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Payment Error:", err);

      toast({
        title: err?.message || "Payment failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        <div className="flex flex-col gap-4">
          {cartItems?.items?.map((item) => (
            <UserCartItemsContent key={item._id} cartItem={item} />
          ))}

          <div className="mt-8 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{totalCartAmount}</span>
          </div>

          <Button onClick={handleRazorpayPayment} className="w-full mt-4">
            Pay with Razorpay
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;