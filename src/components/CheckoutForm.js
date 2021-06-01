import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import config from "../config";

function CheckoutForm(props) {
  const [ succeeded, setSucceeded ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ processing, setProcessing ] = useState("");
  const [ disabled, setDisabled ] = useState(true);
  const [ clientSecret, setClientSecret ] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  useEffect(
    () => {
      // Create PaymentIntent as soon as the page loads
      window
        .fetch(
          `${ config.API_URL }/api/create-payment-intent`, 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: [{ id: "xl-tshirt" }] })
          }
        )
        .then(
          res => {
            return res.json();
          }
        )
        .then(
          data => {
            setClientSecret(data.clientSecret);
          }
        );
    }, 
    []
  );
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };
  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(
      clientSecret, 
      {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      }
    );
    if (payload.error) {
      setError(`Payment failed ${ payload.error.message }`);
      setProcessing(false);
    } 
    else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  }
  const { plant } = props;
  return (
    <div className="container col-9">
      <form className="checkoutForm pt-5 mt-5" id="payment-form" onSubmit={ handleSubmit }>
      <h2 className="text-center mb-2 p-2">  {plant.name } </h2>
      <h3 className="text-center mb-4 p-2"> { plant.price } € </h3>
        <CardElement className="p-2" id="card-element" options={cardStyle} onChange={ handleChange }/>
        <div className="row justify-content-center">
          <button onClick={ props.onCheckout } className="btn btn-sm mt-5 mb-4" disabled={ processing || disabled || succeeded } id="submit">
            <span id="button-text">
            {
              processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay now"
              )
            }
            </span>
          </button>
        </div>
        {/* Show any error that happens when processing the payment */}
        {
          error && (
            <div className="card-error" role="alert">
              { error }
            </div>
          )
        }
        {/* Show a success message upon completion */}
        <p className={
          succeeded ? (
            "result-message text-center"
          ) : (
            "result-message hidden text-center"
          )
        }>
          Payment succeeded, see the result in your
          <a href={ `https://dashboard.stripe.com/test/payments` }> { " " } Stripe dashboard. </a> 
          Refresh the page to pay again.
        </p>
      </form>
      <div className="row justify-content-center mt-4">
        <Link to={ `/` }> 
          <button className="btn btn-sm"> Go back </button> 
        </Link>
      </div>
    </div>
  );
}
/* `/plants/${plant._id}` */
export default CheckoutForm;