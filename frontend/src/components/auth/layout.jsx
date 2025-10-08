import { Outlet } from "react-router-dom";
import authBg from "../../assets/bg.jpg"; // Full screen background image

function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Full screen background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={authBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl">
        {/* Left side text */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-12">
          <div className="max-w-md text-center text-white space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Welcome to EliteTechShop
            </h1>
            <p className="text-lg">
              Discover the latest in computer technology and accessories.
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md bg-white/90 p-8 rounded-lg shadow-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
