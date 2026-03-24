import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productList } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { toast } = useToast();

  // ✅ GET CATEGORY & BRAND FROM URL
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };

    if (!cpyFilters[getSectionId]) {
      cpyFilters[getSectionId] = [getCurrentOption];
    } else {
      const index = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (index === -1) cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(index, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(id) {
    navigate(`/shop/product/${id}`);
  }

  function handleAddtoCart(id, stock) {
    let getCartItems = cartItems?.items || [];

    const existing = getCartItems.find((item) => item.productId === id);

    if (existing && existing.quantity + 1 > stock) {
      toast({
        title: `Only ${existing.quantity} quantity available`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: id,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  // ✅ APPLY CATEGORY / BRAND FROM URL
  useEffect(() => {
    let initialFilters = {};

    if (categoryParam) {
      initialFilters.category = [categoryParam];
    }

    if (brandParam) {
      initialFilters.brand = [brandParam];
    }

    // session filters merge (optional)
    const sessionFilters = JSON.parse(sessionStorage.getItem("filters")) || {};

    const finalFilters = {
      ...sessionFilters,
      ...initialFilters,
    };

    setFilters(finalFilters);
    setSort("price-lowtohigh");
  }, [categoryParam, brandParam]);

  // ✅ UPDATE URL WHEN FILTER CHANGE
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const query = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(query));
    }
  }, [filters]);

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    if (sort !== null) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
        })
      );
    }
  }, [sort, filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="bg-white w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Filtered Products</h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <ArrowUpDownIcon className="h-4 w-4 mr-1" />
                Sort
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                {sortOptions.map((item) => (
                  <DropdownMenuRadioItem key={item.id} value={item.id}>
                    {item.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {productList?.length > 0 ? (
            productList.map((item) => (
              <ShoppingProductTile
                key={item._id}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;