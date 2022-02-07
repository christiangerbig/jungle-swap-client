import { useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsNewRequest,
  setStartAmountOfRequests,
} from "../reducer/jungleSwapSlice";
import { Message, User } from "../typeDefinitions";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import { MessageIO } from "../lib/messageIO";
import RequestTile from "../components/RequestTile";
import WaitSpinner from "../components/WaitSpinner";

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
  const history = useHistory();

  useEffect(() => {
    const resetRequestVariableAndScrollToTop = (): void => {
      dispatch(setIsNewRequest(false));
      scroll.scrollToTop();
    };

    const routing = new Routing(dispatch);
    routing.protect();
    if (loggedInUser) {
      const messageIO = new MessageIO(dispatch);
      messageIO.fetchAll();
      isUserChange && dispatch(setStartAmountOfRequests());
      resetRequestVariableAndScrollToTop();
    }

    return () => {
      resetRequestVariableAndScrollToTop();
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
          <button
            className="btn btn-sm mt-4 smallWidth form-control"
            onClick={() => {
              history.push("/");
              scroll.scrollToTop();
            }}
          >
            Go back
          </button>
        </div>
        {isFetchingMessages ? (
          <WaitSpinner />
        ) : (
          <div>
            {messages.map((message: Message, index: number): JSX.Element => {
              const { seller, messageState } = message;
              return (seller as User)._id === (loggedInUser as User)._id &&
                messageState === true ? (
                <RequestTile message={message} key={index} />
              ) : (
                <></>
              );
            })}
          </div>
        )}
        {amountOfRequests !== 0 ? (
          <div className="text-right mt-4 pr-2">
            <button
              className="btn btn-sm mt-4 smallWidth form-control"
              onClick={() => {
                history.push("/");
                scroll.scrollToTop();
              }}
            >
              Go back
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RequestsPage;
