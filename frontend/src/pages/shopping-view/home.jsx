import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getFeatureImages } from "@/store/common-slice";
import { fetchRecommendations } from "../../store/shop/recommendation-slice";
import { Laptop, Monitor, Usb, Tablet } from "lucide-react";

import bannerOne from "../../assets/b1.jpg";
import bannerTwo from "../../assets/b2.jpg";
import bannerThree from "../../assets/b3.jpg";

const categoriesWithIcon = [
  { id: "computer", label: "Computer", icon: Monitor },
  { id: "laptop", label: "Laptop", icon: Laptop },
  { id: "macbook", label: "MacBook", icon: Laptop },
  { id: "accessories", label: "Accessories", icon: Usb },
  { id: "tablet", label: "Tablet", icon: Tablet },
];

const brandsWithIcon = [
  { id: "dell", label: "Dell" },
  { id: "hp", label: "HP" },
  { id: "lenovo", label: "Lenovo" },
  { id: "asus", label: "ASUS" },
  { id: "apple", label: "Apple" },
  { id: "acer", label: "Acer" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { productList } = useSelector((state) => state.shopProducts);
  const { featureImageList: apiFeatureImages } = useSelector(
    (state) => state.commonFeature
  );
  const { user } = useSelector((state) => state.auth);
  const { items: recommendations, loading } = useSelector(
  (state) => state.recommendations
);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const featureImageList = apiFeatureImages?.length
    ? apiFeatureImages
    : [
        { image: bannerOne },
        { image: bannerTwo },
        { image: bannerThree },
      ];

  // ✅ Load products + banners
  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "" }));
    dispatch(getFeatureImages());
  }, [dispatch]);

  // ✅ Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  // ✅ Recommendations
useEffect(() => {
  if (user?._id) {
    dispatch(fetchRecommendations(user._id));
  }
}, [dispatch, user]);
  const handleGetProductDetails = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop/listing?category=${categoryId}`);
  };

  const handleBrandClick = (brandId) => {
    navigate(`/shop/listing?brand=${brandId}`);
  };

  const handleAddtoCart = (productId) => {
    if (!user?.id) {
      return toast({ title: "Please login first", variant: "destructive" });
    }

    dispatch(addToCart({ userId: user.id, productId, quantity: 1 })).then(
      (res) => {
        if (res?.payload?.success) {
          dispatch(fetchCartItems(user.id));
          toast({ title: "Product added to cart" });
        }
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="relative w-full h-[500px] overflow-hidden">
        {featureImageList.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* RECOMMENDATIONS */}
<section className="py-10 px-6">
  <h2 className="text-2xl font-bold mb-6">
    {recommendations.length > 0
      ? "Recommended for You 🎯"
      : "Trending Products 🔥"}
  </h2>

  {loading ? (
    <p>Loading...</p>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {recommendations.map((product) => (
        <div
          key={product._id}
          className="bg-white p-3 rounded shadow hover:shadow-lg transition"
        >
          <img
            src={product.images?.[0] || "https://via.placeholder.com/150"}
            onClick={() => handleGetProductDetails(product._id)}
            className="w-full h-40 object-cover rounded cursor-pointer"
          />

          <h4 className="mt-2 text-sm font-semibold">
            {product.title}
          </h4>

          <p className="text-green-600 font-bold">
            ₹{product.salePrice || product.price}
          </p>
        </div>
      ))}
    </div>
  )}
</section>
      {/* CATEGORY */}
      <section className="py-10 bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">
          Shop by Category
        </h2>

        <div className="flex justify-center gap-8 flex-wrap">
          {categoriesWithIcon.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="p-4 bg-gray-100 rounded-full shadow group-hover:bg-pink-500 transition">
                <cat.icon className="w-8 h-8 group-hover:text-white" />
              </div>
              <p className="mt-2 text-sm font-medium">{cat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-10">
        <h2 className="text-2xl font-bold text-center mb-6">Top Brands</h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 px-6">
          {brandsWithIcon.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.id)}
              className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition cursor-pointer"
            >
              <p className="font-semibold">{brand.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {productList?.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-3"
              >
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/150"}
                  onClick={() => handleGetProductDetails(product._id)}
                  className="h-48 w-full object-cover rounded-lg cursor-pointer"
                />

                <h3 className="mt-2 font-semibold">
                  {product.title}
                </h3>

                <p className="text-pink-500 font-bold">
                  ₹{product.price}
                </p>

                <button
                  onClick={() => handleAddtoCart(product._id)}
                  className="w-full mt-2 bg-black text-white py-2 rounded"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default ShoppingHome;