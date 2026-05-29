import {NextResponse} from "next/server";
import connectDB from "@/lib/db.js";
import Product from "@/models/product.model.js";
import redis from "@/lib/redis.js";

connectDB();

export const GET=async(req)=>{

  try {

    const products=await redis.get("featuredProducts");

    if(products){
      return NextResponse.json(
        {
          success: true,
          data: JSON.parse(products)
        },
        { status: 200 }
      );
    }

    const featuredProducts=await Product.find({isFeatured: true}).lean();

    if(!featuredProducts){
      return NextResponse.json(
        {
          success: false,
          error: "No featured products found"
        },
        { status: 404 }
      );
    }

    await redis.set("featuredProducts", JSON.stringify(featuredProducts));

    return NextResponse.json(
      {
        success: true,
        data: featuredProducts
      },
      { status: 200 }
    );
    
  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong"
      },
      { status: 500 }
    );
    
  }
}
