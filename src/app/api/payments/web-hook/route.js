import crypto from "crypto";
import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Order from "@/models/order.model";

export const POST = async (req) => {
  try {
    await connectDB();

    const body = await req.text();

    const signature = req.headers.get(
      "x-razorpay-signature"
    );

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET
      )
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Webhook Signature",
        },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment =
        event.payload.payment.entity;

      await Order.findOneAndUpdate(
        {
          razorpayOrderId: payment.order_id,
        },
        {
          razorpayPaymentId: payment.id,
          paymentStatus: "success",
        }
      );
    }

    if (event.event === "payment.failed") {
      const payment =
        event.payload.payment.entity;

      await Order.findOneAndUpdate(
        {
          razorpayOrderId: payment.order_id,
        },
        {
          paymentStatus: "failed",
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
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
