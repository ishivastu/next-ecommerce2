import { NextResponse } from "next/server";
import { protectRoute } from "@/middlewares/auth.middleware.js";

export const PUT = async (req, { params }) => {
  try {
    const { id: productId } = await params;

    const user = await protectRoute();

    if (user instanceof NextResponse) {
      return user;
    }

    const { quantity } = await req.json();

    if (quantity === 0) {
      user.cartItems = user.cartItems.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      const item = user.cartItems.find(
        (item) => item.productId.toString() === productId
      );

      if (!item) {
        return NextResponse.json(
          {
            success: false,
            error: "Item not found in cart",
          },
          { status: 404 }
        );
      }

      item.quantity = quantity;
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
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
};
