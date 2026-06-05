import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export const generateAccessToken = (user) => {

   return jwt.sign(
      { userId: user._id ,role:user.role},
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "30m" }
   )
}

export const generateRefreshToken = (user) => {

   return jwt.sign(
      { userId:user._id ,role:user.role},
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
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
      maxAge: 60 * 30,
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
