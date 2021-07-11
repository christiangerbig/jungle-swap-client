import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {animateScroll as scroll} from "react-scroll";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import config from "../config";

const CheckoutForm = ({plant, headerHeight, introHeight, onCheckout}) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  
  useEffect(
    () => {
      // Create PaymentIntent as soon as the page loads
      window
        .fetch(
          `${config.API_URL}/api/create-payment-intent`,
          {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({price: plant.price})
          }
        )
        .then(
          res => {
            return res.json();
          }
        )
        .then(
          data => setClientSecret(data.clientSecret)
        );
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
        "::placeholder": {color: "#32325d"}
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  // Listen for changes in Card element and display any errors as customer types card details
  const handleChange = async event => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  // Handle payment
  const handleSubmit = async event => {
    event.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(
      clientSecret,
      {payment_method: {card: elements.getElement(CardElement)}}
    );
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    }
    else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  }
  
  const {_id, name, price} = plant;
  return (
    <div className="container col-9">
      <form className="checkoutForm mt-5" id="payment-form" onSubmit={handleSubmit}>
        <h2 className="text-center mb-2 p-2">  {name} </h2>
        <h3 className="text-center mb-4 p-2"> {price} € </h3>
        <CardElement className="p-2" id="card-element" options={cardStyle} onChange={handleChange}/>
        <div className="row justify-content-center">
          <button onClick={onCheckout} className="btn btn-sm mt-5 mb-4" disabled={processing || disabled || succeeded} id="submit">
            <span id="button-text">
              {
                processing ? <div className="spinner" id="spinner"/> : "Pay now"
              }
            </span>
          </button>
        </div>
        {/* Show any error that happens when processing the payment */
          error && (<div className="card-error" role="alert"> {error} </div>)
        /* Show success message upon completion */}
        <p className={succeeded ? "result-message text-center" : "result-message hidden text-center"}>
          Payment succeeded.
        </p>
      </form>
      <div className="row justify-content-center">
        {
          succeeded ? (
            <Link to={"/"} onClick={() => scroll.scrollTo(headerHeight+introHeight)}> <button className="btn btn-sm"> Go back </button> </Link>
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