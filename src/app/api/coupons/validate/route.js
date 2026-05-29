import { NextResponse } from "next/server";
import Coupon from "@/models/coupons.model.js";
import { protectRoute } from "@/middlewares/auth.middleware.js";
import connectDB from "@/lib/db.js";

connectDB();

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
          error: "Forbidden",
        },
        { status: 403 }
      );
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: "Coupon code is required",
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      expiryDate: { $gt: Date.now() },
      userId: user._id,
    });

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          error: "Coupon not found or expired",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: coupon,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Validate Coupon Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
};
