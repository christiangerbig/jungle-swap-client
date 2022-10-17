import { useAppDispatch } from "../hooks";
import {
  checkUserLoggedIn,
  setErrorMessage,
  setLoggedInUser,
} from "../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";

type Routing = {
  protectRoute: Function;
};

export const useRouting = (): Routing => {
  const dispatch = useAppDispatch();
  const routing = {
    protectRoute(callbackFunction: Function): void {
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
  return routing;
};
