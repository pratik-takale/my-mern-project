import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetails");

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    if (!status) {
      toast({ title: "Please select status", variant: "destructive" });
      return;
    }

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  // ✅ Dynamic Badge Color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-500";
      case "confirmed":
        return "bg-blue-500";
      case "shipped":
        return "bg-orange-500";
      case "delivered":
        return "bg-green-600";
      default:
        return "bg-black";
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>
        <VisuallyHidden>Admin Order Details</VisuallyHidden>
      </DialogTitle>

      <div className="grid gap-6">
        {/* ORDER INFO */}
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>₹{orderDetails?.totalAmount}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 text-white ${getStatusColor(
                  orderDetails?.orderStatus
                )}`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator />

        {/* ORDER ITEMS */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems?.length > 0 &&
                orderDetails.cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center justify-between"
                  >
                    <span>Title: {item.title}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>Price: ₹{item.price}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* SHIPPING */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        {/* UPDATE STATUS */}
        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "confirmed", label: "Confirmed" },
                  { id: "shipped", label: "Shipped" },
                  { id: "delivered", label: "Delivered" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;