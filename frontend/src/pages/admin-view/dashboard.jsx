import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [chartData, setChartData] = useState([]);

  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  // 🔥 Fetch dashboard data
  useEffect(() => {
    fetch("http://localhost:5000/api/shop/order/dashboard")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setStats({
            totalOrders: res.totalOrders,
            totalRevenue: res.totalRevenue,
          });

          const formattedData = Object.keys(res.salesData).map((date) => ({
            date,
            revenue: res.salesData[date],
          }));

          setChartData(formattedData);
        }
      });
  }, []);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="p-6 space-y-8">
      
      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h3>Total Orders</h3>
          <p className="text-xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h3>Total Revenue</h3>
          <p className="text-xl font-bold">₹{stats.totalRevenue}</p>
        </div>
      </div>

      {/* 🔥 CHART */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="mb-4 font-semibold">Sales Chart</h3>

        <LineChart width={700} height={300} data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" />
          <Line type="monotone" dataKey="revenue" />
        </LineChart>
      </div>

      {/* 🔥 IMAGE UPLOAD (YOUR OLD FEATURE - KEPT) */}
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      <Button onClick={handleUploadFeatureImage} className="w-full">
        Upload
      </Button>

      <div className="flex flex-col gap-4">
        {featureImageList?.map((img) => (
          <img
            key={img._id}
            src={img.image}
            className="w-full h-[300px] object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;