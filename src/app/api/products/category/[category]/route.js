import { NextResponse } from "next/server";
import Product from "@/models/product.model.js";
import connectDB from "@/lib/db.js";

connectDB();
export const GET=async(req,{params})=>{
  try {

    const {category}=await params;

         const {category} = await params;
    
    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { success: false, error: "Invalid category parameter" },
        { status: 400 }
      );
    }
    
     const products= await Product.find({category});
    const products= await Product.find({category});
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
        error: "failed to fetch products"
      },
      { status: 500 }
    );
    
  }
}
