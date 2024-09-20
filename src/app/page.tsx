"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(
  "pk_test_51PtpgfLlYcDGQ705VAHajAFVc2THgOKPAgczdzIdFjVN2RoxVv9NsExDvkv6z8dFBMvfrvQ2R7dQAMfcwXaSpeYi00es7m9dcw"
);

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);
export default CheckoutPage;
