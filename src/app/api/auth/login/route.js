import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db.js";
import User from "@/models/user.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
  setCookies,
} from "@/lib/generateToken.js";

import redis from "@/lib/redis.js";

export const POST = async (req) => {
  try {
    console.time("TOTAL_LOGIN");

    console.time("connectDB");
    await connectDB();
    console.timeEnd("connectDB");

    console.time("req.json");
    const { email, password } = await req.json();
    console.timeEnd("req.json");

    console.time("findUser");
    const user = await User.findOne({ email });
    console.timeEnd("findUser");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    console.time("bcrypt.compare");
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    console.timeEnd("bcrypt.compare");

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    console.time("generateTokens");
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    console.timeEnd("generateTokens");

    console.time("setCookies");
    await setCookies(accessToken, refreshToken);
    console.timeEnd("setCookies");

    console.time("redis.set");
    await redis.set(
      `refreshToken:${user._id}`,
      refreshToken,
      {
        ex: 60 * 60 * 24 * 7,
      }
    );
    console.timeEnd("redis.set");

    console.timeEnd("TOTAL_LOGIN");

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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
