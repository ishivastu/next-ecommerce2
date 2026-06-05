"use client";

import { create } from "zustand";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });

      set({
        user: res.data.user,
        loading: false,
      });

      toast.success("Account created successfully");
    } catch (error) {
      set({ loading: false });

      toast.error(
        error?.response?.data?.message || "An error occurred"
      );
    }
  },
  login:async(email,password)=>{
    set({loading:true});
    try {
      const res=await axios.post("/auth/login",{email,password});
      set({user:res.data.user,loading:false});
      toast.success("Logged in successfully");
    } catch (error) {
      set({loading:false});
      toast.error(
        error?.response?.data?.error || "An error occurred"
      );
      
    }
  },
  logout:async()=>{
    set({loading:true});
    try {
      await axios.post("/auth/logout");
      set({user:null,loading:false});
      toast.success("Logged out successfully");
    } catch (error) {
      set({loading:false});
      toast.error(
        error?.response?.data?.error || "An error occurred"
      );
    }
  },

  checkAuth:async()=>{
    set({checkingAuth:true})

    try {
      const res=await axios.get("/auth/profile");
      set({user:res.data.user,checkingAuth:false});
    } catch (error) {
      set({checkingAuth:false,user:null});
    }
  }

}));

export default useUserStore;
