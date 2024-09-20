"use client";
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe or elements is not available.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage("Card details are not available.");
      setLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        email,
      },
    });

    if (error) {
      setErrorMessage(error.message || "Failed to create payment method.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://stripe-subscription-6cod.onrender.com/stripe/create-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            paymentMethodId: paymentMethod.id,
            priceId: "price_1PuX59LlYcDGQ705FWFAqmX9",
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setSuccessMessage("Subscription successfully created!");
      }
    } catch (err) {
      setErrorMessage("Failed to create subscription.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter your email"
      />
      <CardElement />
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <button type="submit" disabled={loading || !stripe}>
        {loading ? "Processing..." : "Submit Payment"}
      </button>
    </form>
  );
};

export default CheckoutForm;
