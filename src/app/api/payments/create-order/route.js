import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import razorpay from "@/lib/razorpay";
import Order from "@/models/order.model";

import { protectRoute } from "@/middlewares/auth.middleware";

export const POST = async (req) => {
  try {
    await connectDB();

    const user = await protectRoute();

    if (user instanceof NextResponse) {
      return user;
    }

    const { products} = await req.json();

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

    return NextResponse.json(
      {
        success: true,
      data: razorpayOrder,
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
