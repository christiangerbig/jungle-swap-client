import { useAppDispatch } from "../hooks";
import {
  createPayment,
  setClientSecret,
  setErrorMessage,
} from "../reducer/jungleSwapSlice";
import { Plant } from "../typeDefinitions";

type HandlePayment = {
  initialize: Function;
};

export const useHandlePayment = (): HandlePayment => {
  const dispatch = useAppDispatch();
  const handlePayment = {
    initialize(plant: Plant): void {
      dispatch(createPayment(plant))
        .unwrap()
        .then((payment: any): void => {
          dispatch(setClientSecret(payment.clientSecret));
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },
  };
  return handlePayment;
};