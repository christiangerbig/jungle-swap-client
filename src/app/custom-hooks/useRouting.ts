import { useAppDispatch } from "../hooks";
import {
  checkUserLoggedIn,
  setErrorMessage,
  setLoggedInUser,
} from "../../reducer/jungleSwapSlice";
import { User } from "../../app/typeDefinitions";

interface Routing {
  protectRoute: Function;
}

export const useRouting = (): Routing => {
  const dispatch = useAppDispatch();

  return {
    protectRoute: (callbackFunction: Function): void => {
      dispatch(checkUserLoggedIn())
        .unwrap()
        .then((user: User): void => {
          dispatch(setLoggedInUser(user));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          if (rejectedValue.message !== "Unauthorized user") {
            dispatch(setErrorMessage(rejectedValue.message));
          }
        });
    },
  };
};
