import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { scrollToPlants } from "../../reducer/jungleSwapSlice";
import { Plant } from "../../typeDefinitions";
import { RootState } from "../../store";
import { Stripe } from "@stripe/stripe-js";
import { PaymentIO } from "../../lib/paymentIO";

type CardStyle = {
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
};

const CheckoutForm = (): JSX.Element => {
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const clientSecret = useAppSelector(
    (state: RootState) => state.jungleSwap.clientSecret
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();
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
    const paymentIO = new PaymentIO(dispatch);
    paymentIO.initialize(plant);
    return (): void => {
      history.push("/");
      dispatch(scrollToPlants());
    };
  }, []);

  const handleInputChanges = async (event: any): Promise<void> => {
    setIsDisabled(event.empty);
    setPaymentError(event.error ? event.error.message : "");
  };

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

  const messageVisibility = (): string => {
    return isSucceeded ? "result-message text-center" : "is-hidden";
  };

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
            <span id="button-text">
              {isProcessing ? (
                <div id="spinner" className="spinner is-text-bold" />
              ) : (
                t("texts.plants.checkout.form.payNow")
              )}
            </span>
          </button>
        </div>
        {/* Show any error that happens when processing the payment */}
        {paymentError && (
          <div role="alert" className="card-error">
            {paymentError}
          </div>
        )}
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

export default CheckoutForm;
