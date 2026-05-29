export const POST=async(req)=>{
  try {
    cosnt user=await protectRoute();
    if(user instanceof NextResponse){)
      return user;
    }

    if(user.role!=='user'){
      return NextResponse.json(
        {
          success: false,
          error: "Non user Unauthorized"
        },
        { status: 401 }
      );
    }
    const {code}=await req.json();

    const coupon=await Coupon.findOne({code,isActive:true,expiryDate:{$gt:Date.now()},userId:user._id});
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
