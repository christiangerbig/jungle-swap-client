import { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsNewRequest,
  setStartAmountOfRequests,
} from "../reducer/jungleSwapSlice";
import { Message } from "../typeDefinitions";
import { RootState } from "../store";
import { fetchMessages, protectPage } from "../lib/utilities";
import RequestTile from "../components/RequestTile";
import LoadingSpinner from "../components/LoadingSpinner";

const RequestsPage = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUserChange = useAppSelector(
    (state: RootState) => state.jungleSwap.isUserChange
  );
  const isFetchingMessages = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingMessages
  );
  const messages = useAppSelector(
    (state: RootState) => state.jungleSwap.messages
  );
  const amountOfRequests = useAppSelector(
    (state: RootState) => state.jungleSwap.amountOfRequests
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Reset values and scroll to top
    const resetValues = (): void => {
      dispatch(setIsNewRequest(false));
      scroll.scrollToTop();
    };

    // Fetch all messages if the user is logged in
    protectPage(dispatch);
    if (loggedInUser) {
      fetchMessages(dispatch);
      isUserChange && dispatch(setStartAmountOfRequests());
      resetValues();
    }
    // Reset values at cleanup
    return () => {
      resetValues();
    };
  }, []);

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2> Requests for your plants </h2>
        <h3 className="mb-4"> [{amountOfRequests}] </h3>
        <div className="text-right pr-2">
          <Link to={"/"}>
            <button className="btn btn-sm mt-4 smallWidth form-control">
              Go back
            </button>
          </Link>
        </div>
        {isFetchingMessages ? (
          <LoadingSpinner />
        ) : (
          <div>
            {messages.map((message: Message, index: number): JSX.Element => {
              return <RequestTile message={message} key={index} />;
            })}
          </div>
        )}
        {amountOfRequests !== 0 && (
          <div className="text-right mt-4 pr-2">
            <Link to={"/"}>
              <button className="btn btn-sm mt-4 smallWidth form-control">
                Go back
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
