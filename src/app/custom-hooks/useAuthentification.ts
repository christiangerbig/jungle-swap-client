import { useAppDispatch } from "../hooks";
import {
  setErrorMessage,
  setLoggedInUser,
  signIn,
  signUp,
  logOut,
} from "../../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";

type Authentification = {
  signIn: Function;
  signUp: Function;
  logOut: Function;
};

export const useAuthentification = (): Authentification => {
  const dispatch = useAppDispatch();

  const authentification = {
    signIn: (user: User, callbackFunction: Function): void => {
      dispatch(signIn(user))
        .unwrap()
        .then((user: User): void => {
          dispatch(setLoggedInUser(user));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    signUp: (newUser: User, callbackFunction: Function): void => {
      dispatch(signUp(newUser))
        .unwrap()
        .then((user: User): void => {
          dispatch(setLoggedInUser(user));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    logOut: (loggedInUser: User, callbackFunction: Function): void => {
      dispatch(logOut(loggedInUser))
        .unwrap()
        .then((): void => {
          dispatch(setLoggedInUser(null));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },
  };
  return authentification;
};
