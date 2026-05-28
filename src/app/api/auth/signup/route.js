import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db.js";
import User from "@/models/user.model.js";

connectDB();

export const POST = async (req) => {
  try {

    console.log("signup route hit");
    const { name, email, password } = await req.json();

    if(!name || !email || !password){
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if(password.length < 6){
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    
    let user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const res = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
    return res;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
