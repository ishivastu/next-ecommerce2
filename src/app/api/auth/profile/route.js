import {NextResponse} from "next/server";
import {protectRoute} from "@/middlewares/auth.middleware";

export const GET=async()=>{
  try {
    const user=await protectRoute();
    if(user instanceof NextResponse){
      return user;
    }
    return NextResponse.json({user},{status:200});
  } catch (error) {
    return NextResponse.json({error},{status:500});
  }
}
