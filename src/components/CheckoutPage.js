import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const promise = loadStripe("pk_test_51IQBsPA6EAM4YnfDyrjHWnLHzZ5KkI9tsERzYhBGVoctZBrFUb4Sda035HvcQKpp7thFiqW6QmO8ytPbOAMTg33z00cHvcbojv");

const CheckoutPage = ({ headerContainerHeight, aboutContainerHeight, onCheckout }) => {
  const location = useLocation();
  // Scroll to top as soon as page loads
  useEffect(
    () => scroll.scrollToTop(),
    []
  );

  const { plant } = location;
  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-6 offset-1 offset-md-5 App">
        <Elements stripe={promise}>
          <CheckoutForm
            onCheckout={onCheckout}
            plant={plant}
            headerContainerHeight={headerContainerHeight}
            aboutContainerHeight={aboutContainerHeight}
          />
        </Elements>
      </div>
    </div>
  );
}

export default CheckoutPage;