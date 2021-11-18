import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { readUser, setIsFetchingUser, setLoggedInUser } from "../reducer/jungleSwapSlice";

const promise = loadStripe(
  "pk_test_51IQBsPA6EAM4YnfDyrjHWnLHzZ5KkI9tsERzYhBGVoctZBrFUb4Sda035HvcQKpp7thFiqW6QmO8ytPbOAMTg33z00cHvcbojv"
);

const CheckoutPage = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const dispatch = useAppDispatch();

  // Scroll to top as soon as page loads
  useEffect(() => {
    scroll.scrollToTop();
    dispatch(readUser())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        dispatch(setIsFetchingUser(false));
      })
      .catch((rejectedValue: any) => {
        dispatch(setIsFetchingUser(false));
        console.log(rejectedValue.message);
      });
  }, []);

  if (!loggedInUser) {
    return <Redirect to={"/signup"} />;
  }

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-6 offset-1 offset-md-5 App">
        <Elements stripe={promise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;
