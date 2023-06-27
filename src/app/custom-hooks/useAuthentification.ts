import { useAppDispatch } from "../hooks";
import {
  setErrorMessage,
  setLoggedInUser,
  signIn,
  signUp,
  logOut,
} from "../../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";

interface AuthMethods {
  signIn: (user: User, callback: () => void) => void;
  signUp: (newUser: User, callback: () => void) => void;
  logOut: (loggedInUser: User, callback: () => void) => void;
  updateUserRequestsReplies: (
    loggedInUser: User,
    amountOfRequests: number,
    amountOfReplies: number
  ) => User;
}

export const useAuthentification = (): AuthMethods => {
  const dispatch = useAppDispatch();

  return {
    signIn: (user: User, callback: () => void): void => {
      dispatch(signIn(user))
        .unwrap()
        .then((user: User): void => {
          dispatch(setLoggedInUser(user));
          callback();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    signUp: (newUser: User, callback: () => void): void => {
      dispatch(signUp(newUser))
        .unwrap()
        .then((user: User): void => {
          dispatch(setLoggedInUser(user));
          callback();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    logOut: (loggedInUser: User, callback: () => void): void => {
      dispatch(logOut(loggedInUser))
        .unwrap()
        .then((): void => {
          dispatch(setLoggedInUser(null));
          callback();
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
