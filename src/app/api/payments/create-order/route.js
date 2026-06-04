import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import razorpay from "@/lib/razorpay";

import Order from "@/models/order.model";
import Product from "@/models/product.model";
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

    // Fetch actual products from database
    const productIds = products.map((item) => item._id);

    const dbProducts = await Product.find({
      _id: { $in: productIds },
    });

    if (dbProducts.length !== products.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Some products not found",
        },
        { status: 404 }
      );
    }

    let totalAmount = 0;

    const orderProducts = products.map((cartItem) => {
      const dbProduct = dbProducts.find(
        (product) =>
          product._id.toString() === cartItem._id
      );

      if (!dbProduct) {
        throw new Error(
          `Product ${cartItem._id} not found`
        );
      }

      totalAmount +=
        dbProduct.price * cartItem.quantity;

      return {
        product: dbProduct._id,
        quantity: cartItem.quantity,
        price: dbProduct.price,
      };
    });

    // Coupon Logic
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        userId: user._id,
        isActive: true,
        expiryDate: {
          $gt: new Date(),
        },
      });

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discount) / 100
        );
      }
    }

    // Create Razorpay Order
    const razorpayOrder =
      await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

    // Save Order
    const order = await Order.create({
      user: user._id,

      products: orderProducts,

      totalAmount,

      razorpayOrderId: razorpayOrder.id,

      paymentStatus: "pending",
    });

    // Gift Coupon
    if (totalAmount >= 20000) {
      await Coupon.findOneAndDelete({
        userId: user._id,
      });

      await Coupon.create({
        code:
          "GIFT" +
          Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase(),

        discount: 10,

        expiryDate: new Date(
          Date.now() +
            30 * 24 * 60 * 60 * 1000
        ),

        userId: user._id,
      });
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order._id,
        razorpayOrder,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Create Order Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
