import { useAppDispatch } from "../hooks";
import {
  checkUserLoggedIn,
  setErrorMessage,
  setLoggedInUser,
} from "../../reducer/jungleSwapSlice";
import { User } from "../../app/typeDefinitions";

interface RoutingMethods {
  protectRoute: (callback: () => void) => void;
}

export const useRouting = (): RoutingMethods => {
  const dispatch = useAppDispatch();

  return {
    protectRoute: (callback: () => void): void => {
      dispatch(checkUserLoggedIn())
        .unwrap()
        .then((user: User): void => {
          dispatch(setLoggedInUser(user));
          callback();
        })
        .catch((rejectedValue: any): void => {
          if (rejectedValue.message !== "Unauthorized user") {
            dispatch(setErrorMessage(rejectedValue.message));
          }
        });
    },
  };
};
