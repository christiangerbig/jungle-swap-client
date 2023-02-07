import { useAppDispatch } from "../hooks";
import {
  createPayment,
  setClientSecret,
  setErrorMessage,
} from "../../reducer/jungleSwapSlice";
import { Plant } from "../typeDefinitions";

interface HandlePayment {
  initializePayment: Function;
}

export const usePayment = (): HandlePayment => {
  const dispatch = useAppDispatch();

  return {
    initializePayment: (plant: Plant): void => {
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
};
