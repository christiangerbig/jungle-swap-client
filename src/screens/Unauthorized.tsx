import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setLoggedInUser } from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const Unauthorized = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    loggedInUser && dispatch(setLoggedInUser(null));
  }, []);

  return (
    <div className="notFound">
      <div>
        <h2>
          Oh-oh! <br /> <br />
          We think you got lost in the jungle!
        </h2>
        <h3> 401 Unauthorized </h3>
      </div>
    </div>
  );
};

export default Unauthorized;
