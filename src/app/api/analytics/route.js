import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { protectRoute, adminRoute } from "@/middlewares/auth.middleware";
import {
  getAnalyticsData,
  getDailySalesData,
} from "@/lib/analytics";

export const GET = async () => {
  try {
    await connectDB();

    const user = await protectRoute();

    if (user instanceof NextResponse) {
      return user;
    }

    const adminCheck = await adminRoute(user);

    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    const analyticsData = await getAnalyticsData();

    const endDate = new Date();

    const startDate = new Date(
      endDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    const dailySalesData = await getDailySalesData(
      startDate,
      endDate
    );

    return NextResponse.json(
      {
        analyticsData,
        dailySalesData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
};
