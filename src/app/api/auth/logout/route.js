import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import redis from "@/lib/redis.js"
import jwt from "jsonwebtoken"

export const POST = async () => {

   try {

      const cookieStore = await cookies()

      const refreshToken =
         cookieStore.get("refreshToken")?.value

      if (refreshToken) {
         const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY
         )

         await redis.del(
            `refreshToken:${decoded.userId}`
         )
      }

      cookieStore.delete("accessToken")

      cookieStore.delete("refreshToken")

      return NextResponse.json(
         {
            success: true,
            message: "Logout successful"
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
