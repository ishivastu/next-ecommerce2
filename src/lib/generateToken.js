import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export const generateRefreshToken = (userId,role) => {

   return jwt.sign(
      { userId:userId ,role:role},
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
   )
}

export const generateAccessToken = (userId,role) => {
   return jwt.sign(
      { userId: userId ,role:role},
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "1d" }
   )
}

export const setCookies = async (
   accessToken,
   refreshToken = null
) => {

   const cookieStore = await cookies()

   cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/"
   })

   if (refreshToken) {

      cookieStore.set("refreshToken", refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 60 * 60 * 24 * 7,
         path: "/"
      })
   }
}
