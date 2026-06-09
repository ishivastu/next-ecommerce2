import {NextResponse} from "next/server"
import redis from "@/lib/redis.js"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { generateAccessToken,setCookies } from "@/lib/generateToken.js"

export const POST=async()=>{

  try {

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    const redisToken = await redis.get(
      `refreshToken:${decoded.userId}`
    );

    if (redisToken !== refreshToken) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const accessToken = generateAccessToken(decoded.userId,decoded.role);

    setCookies(accessToken);

    return NextResponse.json(
      { accessToken },
      { status: 200 }
    );

  } catch (error) {

    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );

  }
}
