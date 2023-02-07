import { useAppDispatch } from "../hooks";
import {
  setErrorMessage,
  setLoggedInUser,
  signIn,
  signUp,
  logOut,
} from "../../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";

interface Authentification {
  signIn: Function;
  signUp: Function;
  logOut: Function;
  updateUserRequestsReplies: Function;
}

export const useAuthentification = (): Authentification => {
  const dispatch = useAppDispatch();

  return {
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

    updateUserRequestsReplies: (
      loggedInUser: User,
      amountOfRequests: number,
      amountOfReplies: number
    ): User => {
      const clonedUser: User = JSON.parse(JSON.stringify(loggedInUser));
      clonedUser.amountOfRequests = amountOfRequests;
      clonedUser.amountOfReplies = amountOfReplies;
      dispatch(setLoggedInUser(clonedUser));
      return clonedUser;
    },
  };
};
