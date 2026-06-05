import { NextResponse } from "next/server";
import connectDB from "@/lib/db.js";
import Product from "@/models/product.model.js";
import { protectRoute } from "@/middlewares/auth.middleware.js";
import cloudinary from "@/lib/cloudinary.js";
import redis from "@/lib/redis.js";

connectDB();

export const DELETE = async (req, { params }) => {
  try {
    const {id:productId} =await params;

    console.log(productId);

    const user = await protectRoute();

    if (user instanceof NextResponse) {
      return user;
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Non admin Unauthorized",
        },
        { status: 401 }
      );
    }

    console.log(productId);

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
          productId: productId
        },
        { status: 404 }
      );
    }

    if (product.image) {
      const publicId = product.image
        .split("/")
        .pop()
        .replace(/\.[^/.]+$/, "");

      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const PUT=async(req,{params})=>{

  try {

    const {id}=await params;

    const user=await protectRoute();

    if(user instanceof NextResponse){
      return user;
    }

    if(user.role!=='admin'){
      return NextResponse.json(
        {
          success: false,
          error: "Non admin Unauthorized"
        },
        { status: 401 }
      );
    }

    const product=await Product.findById(id);

    if(!product){
      return NextResponse.json(
        {
          success: false,
          error: "Product not found"
        },
        { status: 404 }
      );
    }

    product.isFeatured= !product.isFeatured;

    await product.save();

    const featuredProducts=await Product.find({isFeatured:true}).lean();

    await redis.set("featuredProducts", JSON.stringify(featuredProducts));

     return NextResponse.json(
      {
        success: true,
        message: "featured toggled",
        isFeatured:product.isFeatured
      },
      { status: 200 }
    );

    
  } catch (error) {

    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
    
  }
}
