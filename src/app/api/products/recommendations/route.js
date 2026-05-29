import { NextResponse } from "next/server";
import Product from "@/models/product.model.js";
import connectDB from "@/lib/db.js";

connectDB();
export const GET=async()=>{
  try {
    
    const products=await Product.aggregate([
      {$sample:{size:3}},
      {$project:{_id:1,name:1, image:1, price:1,description:1}}
    ])

    return NextResponse.json(
      {
        success: true,
        data: products
      },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong"
      },
      { status: 500 }
    );
    
  }
}
