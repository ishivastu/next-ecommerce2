"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import axios from "@/lib/axios";
import { useRazorpay } from "react-razorpay";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const OrderSummary = () => {
	const router = useRouter();
	const { Razorpay } = useRazorpay();

	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	const { cart, total, subtotal, clearCart } = useCartStore();

	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);

	if (isProcessingPayment) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto" />
					<p className="mt-4 text-white text-lg">
						Processing your payment...
					</p>
				</div>
			</div>
		);
	}

	const handlePayment = async () => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
		try {
			const res = await axios.post(
				"/payments/create-order",
				{
					products: cart,
				}
			);

			const options = {
				key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

				amount: res.data.data.amount,

				currency: res.data.data.currency,

				order_id: res.data.data.id,

				name: "E-Commerce Store",

				description: "Order Payment",

				handler: async (paymentResponse) => {
					setIsProcessingPayment(true);

					try {
						const verifyResponse =
							await axios.post(
								"/payments/verify-payment",
								paymentResponse
							);

						if (
							verifyResponse.data.success
						) {
							await clearCart();

							toast.success(
								"Payment successful"
							);

							router.push(
								"/success"
							);
						} else {
							setIsProcessingPayment(
								false
							);

							toast.error(
								"Payment verification failed"
							);

							router.push(
								"/failed"
							);
						}
					} catch (error) {
						console.error(error);

						setIsProcessingPayment(
							false
						);

						toast.error(
							"Payment verification failed"
						);

						router.push(
							"/failed"
						);
					}
				},

				modal: {
					ondismiss: () => {
            setIsProcessingPayment(false);
						toast.error(
							"Payment cancelled"
						);
					},
				},

				theme: {
					color: "#059669",
				},
			};

			const razorpay =
				new Razorpay(options);

			razorpay.open();
		} catch (error) {
			console.error(error);
      setIsProcessingPayment(false);
			toast.error(
				"Failed to initiate payment"
			);
		}
	};

	return (
		<motion.div
			className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className="text-xl font-semibold text-emerald-400">
				Order Summary
			</p>

			<div className="space-y-4">
				<div className="space-y-2">
					<dl className="flex items-center justify-between gap-4">
						<dt className="text-base font-normal text-gray-300">
							Original Price
						</dt>

						<dd className="text-base font-medium text-white">
							${formattedSubtotal}
						</dd>
					</dl>

					<dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
						<dt className="text-base font-bold text-white">
							Total
						</dt>

						<dd className="text-base font-bold text-emerald-400">
							${formattedTotal}
						</dd>
					</dl>
				</div>

				<motion.button
					className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					disabled={isProcessingPayment}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className="flex items-center justify-center gap-2">
					<span className="text-sm font-normal text-gray-400">
						or
					</span>

					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary;
