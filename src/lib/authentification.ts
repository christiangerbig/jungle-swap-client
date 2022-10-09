import {
  logOut,
  setErrorMessage,
  setLoggedInUser,
  signIn,
  signUp,
} from "../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";

export class Authentification {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  signIn = (user: User, callbackFunction: Function): void => {
    this.dispatch(signIn(user))
      .unwrap()
      .then((user: User): void => {
        this.dispatch(setLoggedInUser(user));
        callbackFunction();
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  signUp = (newUser: User, callbackFunction: Function): void => {
    this.dispatch(signUp(newUser))
      .unwrap()
      .then((user: User): void => {
        this.dispatch(setLoggedInUser(user));
        callbackFunction();
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  logOut = (loggedInUser: User, callbackFunction: Function): void => {
    this.dispatch(logOut(loggedInUser))
      .unwrap()
      .then((): void => {
        this.dispatch(setLoggedInUser(null));
        callbackFunction();
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };
}
