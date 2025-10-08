// import { useEffect, useState } from "react";
// import bannerOne from "../../assets/banner-1.webp";
// import bannerTwo from "../../assets/banner-2.webp"; 
// import bannerThree from "../../assets/banner-3.webp";
// import { useDispatch, useSelector } from "react-redux";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchAllFilteredProducts,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { useToast } from "@/components/ui/use-toast";
// import ProductDetailsDialog from "@/components/shopping-view/product-details";
// import { getFeatureImages } from "@/store/common-slice";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";

// // lucide-react icons
// import {
//   Laptop,
//   Cpu,
//   Monitor,
//   Usb,
//   Tablet,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// const categoriesWithIcon = [
//   { id: "computer", label: "Computer", icon: Cpu },
//   { id: "laptop", label: "Laptop", icon: Laptop },
//   { id: "macbook", label: "MacBook", icon: Monitor },
//   { id: "accessories", label: "Accessories", icon: Usb },
//   { id: "tablet", label: "Tablet", icon: Tablet },
// ];

// const brandsWithIcon = [
//   { id: "dell", label: "Dell", icon: Laptop },
//   { id: "hp", label: "HP", icon: Laptop },
//   { id: "lenovo", label: "Lenovo", icon: Laptop },
//   { id: "asus", label: "ASUS", icon: Laptop },
//   { id: "apple", label: "Apple", icon: Laptop },
//   { id: "acer", label: "Acer", icon: Laptop },
// ];

// function ShoppingHome() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const { productList, productDetails } = useSelector(
//     (state) => state.shopProducts
//   );
//   const { featureImageList } = useSelector((state) => state.commonFeature);
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // Navigate to Listing Page with filter
//   const handleNavigateToListingPage = (item, section) => {
//     sessionStorage.removeItem("filters");
//     const currentFilter = { [section]: [item.id] };
//     sessionStorage.setItem("filters", JSON.stringify(currentFilter));
//     navigate(`/shop/listing`);
//   };

//   // Fetch Product Details
//   const handleGetProductDetails = (productId) => {
//     dispatch(fetchProductDetails(productId));
//   };

//   // Add to cart
//   const handleAddtoCart = (productId) => {
//     dispatch(
//       addToCart({ userId: user?.id, productId, quantity: 1 })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast({ title: "Product is added to cart" });
//       }
//     });
//   };

//   useEffect(() => {
//     if (productDetails) setOpenDetailsDialog(true);
//   }, [productDetails]);

//   useEffect(() => {
//     if (featureImageList?.length > 0) {
//       const timer = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
//       }, 15000);
//       return () => clearInterval(timer);
//     }
//   }, [featureImageList]);

//   useEffect(() => {
//     dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
//     dispatch(getFeatureImages());
//   }, [dispatch]);

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Banner Slider */}
//       <div className="relative w-full h-[600px] overflow-hidden">
//         {featureImageList?.map((slide, index) => (
//           <img
//             key={index}
//             src={slide.image}
//             alt={`slide-${index}`}
//             className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
//               index === currentSlide ? "opacity-100" : "opacity-0"
//             }`}
//           />
//         ))}

//         <Button
//           variant="outline"
//           size="icon"
//           className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80"
//           onClick={() =>
//             setCurrentSlide(
//               (prev) => (prev - 1 + featureImageList.length) % featureImageList.length
//             )
//           }
//         >
//           <ChevronLeft className="w-6 h-6" />
//         </Button>
//         <Button
//           variant="outline"
//           size="icon"
//           className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80"
//           onClick={() =>
//             setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
//           }
//         >
//           <ChevronRight className="w-6 h-6" />
//         </Button>
//       </div>

//       {/* Categories */}
//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//             {categoriesWithIcon.map((category) => {
//               const Icon = category.icon;
//               return (
//                 <Card
//                   key={category.id}
//                   className="cursor-pointer hover:shadow-lg transition-shadow"
//                   onClick={() => handleNavigateToListingPage(category, "category")}
//                 >
//                   <CardContent className="flex flex-col items-center justify-center p-6">
//                     <Icon className="w-12 h-12 mb-4 text-primary" />
//                     <span className="font-bold">{category.label}</span>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Brands */}
//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {brandsWithIcon.map((brand) => {
//               const Icon = brand.icon;
//               return (
//                 <Card
//                   key={brand.id}
//                   className="cursor-pointer hover:shadow-lg transition-shadow"
//                   onClick={() => handleNavigateToListingPage(brand, "brand")}
//                 >
//                   <CardContent className="flex flex-col items-center justify-center p-6">
//                     <Icon className="w-12 h-12 mb-4 text-primary" />
//                     <span className="font-bold">{brand.label}</span>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Feature Products */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {productList?.map((product) => (
//               <ShoppingProductTile
//                 key={product._id}
//                 product={product}
//                 handleGetProductDetails={handleGetProductDetails}
//                 handleAddtoCart={handleAddtoCart}
//               />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Product Details Dialog */}
//       <ProductDetailsDialog
//         open={openDetailsDialog}
//         setOpen={setOpenDetailsDialog}
//         productDetails={productDetails}
//       />
//     </div>
//   );
// }

// export default ShoppingHome;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

// lucide-react icons
import { Laptop, Cpu, Monitor, Usb, Tablet, ChevronLeft, ChevronRight } from "lucide-react";

// Local banner images
import bannerOne from "../../assets/b1.jpg";
import bannerTwo from "../../assets/b2.jpg"; 
import bannerThree from "../../assets/b3.jpg";

const categoriesWithIcon = [
  { id: "computer", label: "Computer", icon: Monitor},
  { id: "laptop", label: "Laptop", icon: Laptop },
  { id: "macbook", label: "MacBook", icon: Laptop },
  { id: "accessories", label: "Accessories", icon: Usb },
  { id: "tablet", label: "Tablet", icon: Tablet },
];

const brandsWithIcon = [
  { id: "dell", label: "Dell", icon: Laptop },
  { id: "hp", label: "HP", icon: Laptop },
  { id: "lenovo", label: "Lenovo", icon: Laptop },
  { id: "asus", label: "ASUS", icon: Laptop },
  { id: "apple", label: "Apple", icon: Laptop },
  { id: "acer", label: "Acer", icon: Laptop },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList: apiFeatureImages } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fallback feature images if API doesn't return anything
  const featureImageList = apiFeatureImages?.length
    ? apiFeatureImages
    : [
        { image: bannerOne },
        { image: bannerTwo },
        { image: bannerThree },
      ];

  // Navigate to Listing Page
  const handleNavigateToListingPage = (item, section) => {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem("filters", JSON.stringify({ [section]: [item.id] }));
    navigate("/shop/listing");
  };

  // Fetch Product Details
  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  // Add to cart
  const handleAddtoCart = (productId) => {
    if (!user?.id) return toast({ title: "Please login first", variant: "destructive" });
    dispatch(addToCart({ userId: user.id, productId, quantity: 1 })).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Product is added to cart" });
      }
    });
  };

  // Open dialog when productDetails changes
  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Banner slider auto change
  useEffect(() => {
    if (featureImageList?.length >0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
      }, 2000);
      return () => clearInterval(timer);
    }
  },
   [featureImageList]);

  // Fetch products & feature images
  // useEffect(() => {
  //   dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  //   dispatch(getFeatureImages());
  // }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Slider */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList?.map((slide, index) => (
          <img
            key={index}
            src={slide?.image}
            alt={`slide-${index}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 z-20"
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + featureImageList.length) % featureImageList.length)
          }
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 z-20"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
          }
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleNavigateToListingPage(category, "category")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Icon className="w-12 h-12 mb-4 text-primary" />
                    <span className="font-bold">{category.label}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brand) => {
              const Icon = brand.icon;
              return (
                <Card
                  key={brand.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleNavigateToListingPage(brand, "brand")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Icon className="w-12 h-12 mb-4 text-primary" />
                    <span className="font-bold">{brand.label}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
