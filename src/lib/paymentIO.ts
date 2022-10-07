import {
  createPayment,
  setClientSecret,
  setErrorMessage,
} from "../reducer/jungleSwapSlice";
import { Plant } from "../typeDefinitions";

export class PaymentIO {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  initialize = (plant: Plant): void => {
    this.dispatch(createPayment(plant))
      .unwrap()
      .then((payment: any) => {
        this.dispatch(setClientSecret(payment.clientSecret));
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };
}
