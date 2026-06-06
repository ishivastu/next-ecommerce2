import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import razorpay from "@/lib/razorpay";
import Order from "@/models/order.model";
import Coupon from "@/models/coupons.model";
import { protectRoute } from "@/middlewares/auth.middleware";

export const POST = async (req) => {
  try {
    await connectDB();

    const user = await protectRoute();

    if (user instanceof NextResponse) {
      return user;
    }

    const { products, couponCode } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or empty products array",
        },
        { status: 400 }
      );
    }

    let totalAmount = 0;

    for (const product of products) {
      totalAmount += product.price * product.quantity;
    }

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        userId: user._id,
        isActive: true,
      });

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Order.create({
      user: user._id,

      products: products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
        price: product.price,
      })),

      totalAmount,

      razorpayOrderId: razorpayOrder.id,

      paymentStatus: "pending",
    });

    if (totalAmount >= 20000) {
      await Coupon.findOneAndDelete({
        userId: user._id,
      });

      await Coupon.create({
        code:
          "GIFT" +
          Math.random().toString(36).substring(2, 8).toUpperCase(),

        discountPercentage: 10,

        expirationDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ),

        userId: user._id,
      });
    }

    return NextResponse.json(
      {
        success: true,
        order: razorpayOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
};
