import { NextResponse } from "next/server";
import { protectRoute } from "@/middlewares/auth.middleware.js";
import connectDB from "@/lib/db.js";
import Product from "@/models/product.model.js";

connectDB();

export const GET = async () => {
  try {
    const user = await protectRoute();

    if (user instanceof NextResponse) {
      return user;
    }

    if (user.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const productIds = user.cartItems.map(
      (item) => item.productId
    );

    const products = await Product.find({
      _id: { $in: productIds },
    });

    const cartProducts = products.map((product) => {
      const cartItem = user.cartItems.find(
        (item) =>
          item.productId.toString() === product._id.toString()
      );

      return {
        ...product.toObject(),
        quantity: cartItem.quantity,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: cartProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getCartProducts:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    const user = await protectRoute();

    if (user instanceof NextResponse) {
      return user;
    }

    if (user.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          error: "Non user Unauthorized",
        },
        { status: 401 }
      );
    }

    const { cartId } = await req.json();

    const existingCart = user.cartItems.find(
      (item) => item.productId.toString() === cartId
    );

    if (existingCart) {
      existingCart.quantity += 1;
    } else {
      user.cartItems.push({
        productId: cartId,
        quantity: 1,
      });
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        data: user.cartItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const user = await protectRoute();

    if (user instanceof NextResponse) {
      return user;
    }

    if (user.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) => item.productId.toString() !== productId
      );
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        data: user.cartItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing from cart:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
};
