import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useHandlePayment } from "../../app/custom-hooks/useHandlePayment";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  scrollToPlants,
  selectClientSecret,
  selectPlant,
} from "../../reducer/jungleSwapSlice";
import { Plant } from "../../app/typeDefinitions";
import { Stripe } from "@stripe/stripe-js";
import PaymentErrorMessage from "./PaymentErrorMessage";

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

const PaymentCheckoutForm = (): JSX.Element => {
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const clientSecret = useAppSelector(selectClientSecret);
  const plant = useAppSelector(selectPlant);
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const stripe = useStripe();
  const elements = useElements();
  const { initializePayment } = useHandlePayment();
  const { t } = useTranslation();
  const { _id, name, price } = plant as Plant;
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

  useEffect(() => {
    initializePayment(plant);

    return (): void => {
      push("/");
      dispatch(scrollToPlants());
    };
  }, []);

  const handleSubmitPayment = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Stripe.js has not yet been loaded
    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);
    const payload = await (stripe as Stripe).confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) } as any,
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

  const handleInputChanges = async ({ empty, error }: any): Promise<void> => {
    setIsDisabled(empty);
    setPaymentError(error ? error.message : "");
  };

  const processingState = (): JSX.Element | string =>
    isProcessing ? (
      <div id="spinner" className="spinner is-text-bold" />
    ) : (
      t("texts.plants.checkout.form.payNow")
    );

  const messageVisibility = (): string =>
    isSucceeded ? "result-message text-center" : "is-hidden";

  return (
    <div className="container col-md-9 col-sm-12">
      <h2 className="mb-4 is-word-break">{name}</h2>
      <h3 className="mb-4">
        {t("texts.plants.checkout.form.price")} {price}{" "}
        {t("texts.plants.checkout.form.currency")}
      </h3>
      <form
        id="payment-form"
        className="checkoutForm form-style mt-5"
        onSubmit={handleSubmitPayment}
      >
        <CardElement
          id="card-element"
          options={cardStyle}
          className="p-2"
          onChange={handleInputChanges}
        />
        <div className="row justify-content-center">
          <button
            type="submit"
            id="submit"
            disabled={isProcessing || isDisabled || isSucceeded}
            className="btn btn-sm mt-5 mb-4 card-button"
          >
            <span id="button-text">{processingState()}</span>
          </button>
        </div>
        {/* Show any error that happens when processing the payment */}
        <PaymentErrorMessage errorMessage={paymentError} />
        {/* Show success message upon completion */}
        <p className={messageVisibility()}>
          {t("texts.plants.checkout.form.paymentSuccessful")}
        </p>
      </form>
      <div className="row justify-content-center">
        {isSucceeded ? (
          <Link
            to={"/"}
            onClick={(): void => {
              dispatch(scrollToPlants());
            }}
            className="is-link"
          >
            <button className="btn btn-sm form-control">
              {t("button.goBack")}
            </button>
          </Link>
        ) : (
          <Link to={`/plants/fetch/${_id}`} className="is-link">
            <button className="btn btn-sm form-control pl-3 pr-3">
              {t("button.goBack")}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PaymentCheckoutForm;
