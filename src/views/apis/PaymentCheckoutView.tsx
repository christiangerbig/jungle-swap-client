import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { selectLoggedInUser } from "../../reducer/jungleSwapSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentCheckoutForm from "../../components/apis/PaymentCheckoutForm";

const PaymentCheckoutView = (): JSX.Element => {
  const [stripePromise] = useState(() =>
    loadStripe(
      "pk_test_51IQBsPA6EAM4YnfDyrjHWnLHzZ5KkI9tsERzYhBGVoctZBrFUb4Sda035HvcQKpp7thFiqW6QmO8ytPbOAMTg33z00cHvcbojv"
    )
  );
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const { protectRoute } = useRouting();
  const { scrollToTop } = scroll;

  useEffect(() => {
    protectRoute((): void => {
      scrollToTop();
    });
  }, []);

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-6 offset-1 offset-md-5">
        <Elements stripe={stripePromise}>
          <PaymentCheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentCheckoutView;
