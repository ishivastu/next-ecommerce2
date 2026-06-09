import {NextResponse} from "next/server";
import {protectRoute} from "@/middlewares/auth.middleware";
import connectDB from "@/lib/db";

export const DELETE=async(req)=>{
  try {
    await connectDB();
    const user=await protectRoute();
    if(user instanceof NextResponse){
      return user;
    }
    user.cartItems=[];
    await user.save();

    return NextResponse.json({success:true},{status:200});
  } catch (error) {
    return NextResponse.json({error:error.message},{status:500});
  }
}
