import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { protectPage } from "../lib/utilities";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51IQBsPA6EAM4YnfDyrjHWnLHzZ5KkI9tsERzYhBGVoctZBrFUb4Sda035HvcQKpp7thFiqW6QmO8ytPbOAMTg33z00cHvcbojv"
);

const CheckoutPage = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Scroll to top as soon as page loads if the user is logged in
    protectPage(dispatch);
    loggedInUser && scroll.scrollToTop();
  }, []);

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-6 offset-1 offset-md-5 App">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;
