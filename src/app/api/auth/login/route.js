import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import connectDB from "@/lib/db.js"
import User from "@/models/user.model.js"

import { generateAccessToken,generateRefreshToken,setCookies } from "@/lib/generateToken.js"
import redis from "@/lib/redis.js"

export const POST = async (req) => {

   try {

      await connectDB()

      const { email, password } = await req.json()

      const user = await User.findOne({ email })

      if (!user) {
         return NextResponse.json(
            {
               success: false,
               error: "User not found"
            },
            { status: 404 }
         )
      }

      const isMatch = await bcrypt.compare(
         password,
         user.password
      )

      if (!isMatch) {
         return NextResponse.json(
            {
               success: false,
               error: "Invalid credentials"
            },
            { status: 401 }
         )
      }

     const accessToken = generateAccessToken(user._id)
      const refreshToken = generateRefreshToken(user._id)

     await setCookies(accessToken, refreshToken);
      

      await redis.set(
         `refreshToken:${user._id}`,
         refreshToken,
         {
            ex: 60 * 60 * 24 * 7
         }
      )

      return NextResponse.json(
         {
            success: true,
            message: "Login successful",

            user: {
               userId: user._id,
               name: user.name,
               email: user.email,
               role: user.role
            }
         },
         { status: 200 }
      )

   } catch (error) {

      console.log(error)

      return NextResponse.json(
         {
            success: false,
            error: "Something went wrong"
         },
         { status: 500 }
      )
   }
}
