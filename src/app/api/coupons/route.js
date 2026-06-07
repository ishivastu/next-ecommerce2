import { NextResponse } from "next/server";
import Coupon from "@/models/coupons.model.js";
import { protectRoute } from "@/middlewares/auth.middleware.js";
import connectDB from "@/lib/db.js";

connectDB();

export const GET = async () => {
  try {
    const user = await protectRoute();

    if (user instanceof NextResponse) {
      return user;
    }

    const coupons = await Coupon.find({
      userId: user._id,
      isActive: true,
    });

    if (coupons.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Coupons not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: coupons,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Coupons Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
};
