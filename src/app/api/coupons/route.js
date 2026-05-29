import { NextResponse } from "next/server";
import Coupon from "@/models/coupons.model.js";
import { protectRoute } from "@/middlewares/auth.middleware.js";
import connectDB from "@/lib/db.js";

export const GET = async () => {
  try {
    await connectDB();
    const user = await protectRoute();
    
    if (user instanceof NextResponse) {
      return user;
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Non admin Unauthorized",
        },
        { status: 403 }
      );
    }
    const coupons = await Coupon.find({ userId: user._id, isActive: true });

    if (!coupons || coupons.length === 0){
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
