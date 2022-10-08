import {
  checkUserLoggedIn,
  setErrorMessage,
  setLoggedInUser,
} from "../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";

export class Routing {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }
  protect = (callbackFunction: Function): void => {
    this.dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user: User) => {
        this.dispatch(setLoggedInUser(user));
        callbackFunction();
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };
}
