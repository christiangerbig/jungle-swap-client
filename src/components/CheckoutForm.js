import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { payPlant, createPayment, scrollToPlants } from "../Reducer/jungleSwapSlice";

const CheckoutForm = () => {
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const clientSecret = useSelector(state => state.jungleSwap.clientSecret);
  const plant = useSelector(state => state.jungleSwap.plant);
  const dispatch = useDispatch();
  const history = useHistory();

  // Create payment as soon as page loads
  useEffect(
    () => {
      dispatch(createPayment(plant))
      return () => {
        history.push("/");
        dispatch(scrollToPlants());
      }
    },
    []
  );

  // Card styling
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": { color: "#32325d" }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  // Plant payment
  const handlePayPlant = (history) => {
    dispatch(payPlant(history));
  }

  // Listen for changes in Card element and display any errors as customer types card details
  const handleChange = async event => {
    setIsDisabled(event.empty);
    setPaymentError(event.error ? event.error.message : "");
  };

  // Submit payment
  const handleSubmitPayment = async event => {
    event.preventDefault();
    setIsProcessing(true);
    const payload = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: elements.getElement(CardElement) } }
    );
    if (payload.error) {
      setPaymentError(`Payment failed ${payload.error.message}`);
      setIsProcessing(false);
    }
    else {
      setPaymentError(null);
      setIsProcessing(false);
      setIsSucceeded(true);
    }
  }

  const { _id, name, price } = plant;
  return (
    <div className="container col-9">
      <form className="checkoutForm mt-5" id="payment-form" onSubmit={handleSubmitPayment}>
        <h2 className="text-center mb-2 p-2"> {name} </h2>
        <h3 className="text-center mb-4 p-2"> {price} € </h3>
        <CardElement
          className="p-2"
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
        <div className="row justify-content-center">
          <button onClick={() => handlePayPlant(history)} className="btn btn-sm mt-5 mb-4" disabled={isProcessing || isDisabled || isSucceeded} id="submit">
            <span id="button-text">
              {isProcessing ? <div className="spinner" id="spinner" /> : "Pay now"}
            </span>
          </button>
        </div>
        {/* Show any error that happens when processing the payment */
          paymentError && (<div className="card-error" role="alert"> {paymentError} </div>)
        /* Show success message upon completion */}
        <p className={isSucceeded ? "result-message text-center" : "result-message hidden text-center"}>
          Payment succeeded.
        </p>
      </form>
      <div className="row justify-content-center">
        {
          isSucceeded ? (
            <Link to={"/"} onClick={() => dispatch(scrollToPlants())}> <button className="btn btn-sm"> Go back </button> </Link>
          )
            : (
              <Link to={`/plants/read/${_id}`}> <button className="btn btn-sm"> Go back </button> </Link>
            )
        }
      </div>
    </div>
  );
}

export default CheckoutForm;