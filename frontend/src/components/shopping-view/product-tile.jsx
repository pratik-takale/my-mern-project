import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({ product, handleAddtoCart }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : ["https://via.placeholder.com/300"];

  // 🔥 Auto slider on hover
  useEffect(() => {
    let interval;

    if (hovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 800);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hovered, images]);

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-xl transition-all duration-300 cursor-pointer">

      {/* CLICK AREA */}
      <div
        onClick={() => {
          if (product?._id) {
            navigate(`/shop/product/${product._id}`);
          }
        }}
      >

        {/* 🔥 IMAGE SLIDER */}
        <div
          className="relative overflow-hidden rounded-t-lg"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setCurrentIndex(0);
          }}
        >
          <img
            src={images[currentIndex]}
            alt="product"
            className="w-full h-[300px] object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* 🔥 HOVER OVERLAY */}
          {hovered && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-semibold text-sm">
              View Product
            </div>
          )}

          {/* 🔴 BADGES */}
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">
              Only {product?.totalStock} left
            </Badge>
          ) : product?.salePrice && product.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">
              Sale
            </Badge>
          ) : null}

          {/* 🔥 DOTS */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === currentIndex ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-2 line-clamp-2">
            {product?.title || "No Title"}
          </h2>

          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              {categoryOptionsMap?.[product?.category] || "N/A"}
            </span>
            <span>
              {brandOptionsMap?.[product?.brand] || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`${
                product?.salePrice && product.salePrice > 0
                  ? "line-through text-gray-400"
                  : ""
              } text-lg font-semibold`}
            >
              ₹{product?.price || 0}
            </span>

            {product?.salePrice && product.salePrice > 0 && (
              <span className="text-lg font-bold text-green-600">
                ₹{product.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* FOOTER */}
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (product?._id) {
                handleAddtoCart(product._id, product?.totalStock);
              }
            }}
            className="w-full"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;