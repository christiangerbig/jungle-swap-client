import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  setClientSecret,
  createPayment,
  scrollToPlants,
} from "../reducer/jungleSwapSlice";
import { Plant } from "../reducer/typeDefinitions";
import { RootState } from "../store";

interface CardStyle {
  style: {
    base: {
      color: string;
      fontFamily: string;
      fontSmoothing: string;
      fontSize: string;
      "::placeholder": { color: string };
    };
    invalid: {
      color: string;
      iconColor: string;
    };
  };
}

const CheckoutForm = (): JSX.Element => {
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const clientSecret = useAppSelector(
    (state: RootState) => state.jungleSwap.clientSecret
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Create payment as soon as page loads
  useEffect(() => {
    dispatch(createPayment(plant))
      .unwrap()
      .then((payment: any) => {
        dispatch(setClientSecret(payment.clientSecret));
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
    return () => {
      history.push("/");
      dispatch(scrollToPlants());
    };
  }, []);

  // Card styling
  const cardStyle: CardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": { color: "#32325d" },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  // Listen for changes in Card element and display any errors as customer types card details
  const handleChange = async (event: any): Promise<void> => {
    setIsDisabled(event.empty);
    setPaymentError(event.error ? event.error.message : "");
  };

  // Submit payment
  const handleSubmitPayment = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }
    setIsProcessing(true);
    const payload = await (stripe as any).confirmCardPayment(clientSecret, {
      payment_method: { card: (elements as any).getElement(CardElement) },
    });
    if (payload.error) {
      setPaymentError(`Payment failed ${payload.error.message}`);
      setIsProcessing(false);
    } else {
      setPaymentError("");
      setIsProcessing(false);
      setIsSucceeded(true);
    }
  };
  const { _id, name, price } = plant as Plant;

  return (
    <div className="container col-9">
      <form
        className="checkoutForm mt-5"
        id="payment-form"
        onSubmit={handleSubmitPayment}
      >
        <h2 className="text-left mb-2 p-2"> {name} </h2>
        <h3 className="text-left mb-4 p-2"> Price: {price} € </h3>
        <CardElement
          className="p-2"
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
        <div className="row justify-content-center">
          <button
            className="btn btn-sm mt-5 mb-4"
            type="submit"
            disabled={isProcessing || isDisabled || isSucceeded}
            id="submit"
          >
            <span id="button-text">
              {isProcessing ? (
                <div className="spinner" id="spinner" />
              ) : (
                "Pay now"
              )}
            </span>
          </button>
        </div>
        {
          /* Show any error that happens when processing the payment */
          paymentError && (
            <div className="card-error" role="alert">
              {paymentError}
            </div>
          )
        }
        <p
          className={
            /* Show success message upon completion */
            isSucceeded
              ? "result-message text-center"
              : "result-message hidden text-center"
          }
        >
          Payment succeeded.
        </p>
      </form>
      <div className="row justify-content-center">
        {isSucceeded ? (
          <Link
            to={"/"}
            onClick={() => {
              dispatch(scrollToPlants());
            }}
          >
            <button className="btn btn-sm form-control"> Go back </button>
          </Link>
        ) : (
          <Link to={`/plants/fetch/${_id}`}>
            <button className="btn btn-sm form-control"> Go back </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
