import {NextResponse} from "next/server";
import Product from "@/models/product.model.js";
import connectDB from "@/lib/db.js";
import { protectRoute } from "@/middlewares/auth.middleware.js";
import cloudinary from "@/lib/cloudinary.js";

connectDB();

export const GET=async(req)=>{
  try {

    const user=await protectRoute();

    if (user instanceof NextResponse) {
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

    const products=await Product.find();
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
        error: error.message
      },
      { status: 500 }
    );
  }
}

export const POST = async (req) => {
  try {
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

    const product = await req.json();

    const {
      name,
      description,
      price,
      image,
      category,
    } = product;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(
        image,
        {
          folder: "products",
        }
      );
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url,
      category,
    });

    return NextResponse.json(
      {
        success: true,
        product: newProduct,
      },
      { status: 201 }
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
