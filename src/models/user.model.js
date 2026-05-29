import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true
  },
  password:{
    type:String,
    minLength:6,
    required:true
  },
  cartItems:[{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'customer'
  }
},{timestamps:true})

const User=mongoose.model.User || mongoose.model('User',userSchema);

export default User;
