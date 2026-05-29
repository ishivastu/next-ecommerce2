import { NextResponse } from 'next/server';
import { protectRoute } from '@/middlewares/auth.middleware.js';
import Coupon from '@/models/coupons.model.js';
import connectDB from '@/lib/db.js';

export const POST=async(req)=>{
  try {
    await connectDB();
    const user=await protectRoute();
    if (user instanceof NextResponse) {
      return user;
    }

    if(user.role!=='user'){
      return NextResponse.json(
        {
          success: false,
          error: "Non user Unauthorized"
        },
        { status: 403 }
      );
    }
    let code;
    try {
      const body = await req.json();
      code = body.code;
    } catch {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }
    if (typeof code !== 'string' || code.trim() === '') {
      return NextResponse.json({ success: false, error: "Invalid coupon code" }, { status: 400 });
    }
    const coupon = await Coupon.findOne({ code, isActive: true, expiryDate: { $gt: Date.now() }, userId: user._id });
    if(!coupon){
      return NextResponse.json(
        {
          success: false,
          error: "Coupon not found"
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: coupon
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
