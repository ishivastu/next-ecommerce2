import { NextResponse } from "next/server";
import Coupon from "@/models/coupon.model.js";
import { protectRoute } from "@/middlewares/auth.middleware.js";
import connectDB from "@/lib/db.js";

connectDB();

export const GET = async () => {
  try {
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
        { status: 401 }
      );
    }
    const coupons = await Coupon.find({userId=user._id},{isActive:true});

    if(!coupons){
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
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
};
