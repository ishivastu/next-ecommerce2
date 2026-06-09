import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import useUserStore from "@/store/useAuthstore";
import { useCartStore } from "@/store/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", {
        id: "login",
      });
      return;
    }

    addToCart(product);
    };

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">

      {/* Image Section */}
      <div className="relative mx-3 mt-3 h-60 overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          className="block h-full w-full object-cover"
          onLoad={() => console.log("Image loaded")}
          onError={() => console.log("Image failed")}
        />

        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Product Info */}
      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>

        <div className="mb-5 mt-2 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">
              ${product.price}
            </span>
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;


