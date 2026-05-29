import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/user.model.js";
import connectDB from "@/lib/db.js";

connectDB();

export const protectRoute=async()=>{
  try {

    const cookieStore=await cookies();
    const accessToken=cookieStore.get('accessToken')?.value;

    if(!accessToken){
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 401 }
      );
    }

    const decoded=jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );

    const user=await User.findById(decoded.userId).select('-password');

    if(!user){
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    return user;
    
  } catch (error) {

    return NextResponse.json(
      { error: "Invalid access token" },
      { status: 401 }
    );
    
  }
}
