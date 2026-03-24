import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log(location.pathname, isAuthenticated);

  // ROOT
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      return user?.role === "admin"
        ? <Navigate to="/admin/dashboard" />
        : <Navigate to="/shop/home" />;
    }
  }

  // NOT LOGGED IN
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  // LOGGED IN → LOGIN PAGE BLOCK
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" />
      : <Navigate to="/shop/home" />;
  }

  // USER TRYING ADMIN
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // ❌ FIXED: allow product page
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop") &&
    !location.pathname.includes("/shop/product") // ✅ allow product page
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;