import React, {useEffect} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import {animateScroll as scroll} from "react-scroll";

const promise = loadStripe("pk_test_51IQBsPA6EAM4YnfDyrjHWnLHzZ5KkI9tsERzYhBGVoctZBrFUb4Sda035HvcQKpp7thFiqW6QmO8ytPbOAMTg33z00cHvcbojv");

const CheckoutPage = ({location, headerHeight, aboutHeight, onCheckout}) => {
  useEffect(
    () => scroll.scrollToTop(),
    []
  );
  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-6 offset-1 offset-md-5 App">
        <Elements stripe={promise}>
          <CheckoutForm onCheckout={onCheckout} plant={location.plant} headerHeight={headerHeight} aboutHeight={aboutHeight}/>
        </Elements>
      </div>
    </div>
  );
}

export default CheckoutPage;