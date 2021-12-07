import { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsNewReply,
  setStartAmountOfReplies,
} from "../reducer/jungleSwapSlice";
import { Message } from "../typeDefinitions";
import { RootState } from "../store";
import { fetchMessages, protectRoute } from "../lib/utilities";
import ReplyTile from "../components/ReplyTile";
import LoadingSpinner from "../components/LoadingSpinner";

const RepliesPage = (): JSX.Element => {
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
  const amountOfReplies = useAppSelector(
    (state: RootState) => state.jungleSwap.amountOfReplies
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const resetReplyVariableAndScrollToTop = (): void => {
      dispatch(setIsNewReply(false));
      scroll.scrollToTop();
    };

    protectRoute(dispatch);
    if (loggedInUser) {
      fetchMessages(dispatch);
      isUserChange && dispatch(setStartAmountOfReplies());
      resetReplyVariableAndScrollToTop();
    }

    return () => {
      resetReplyVariableAndScrollToTop();
    };
  }, []);

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2> Replies for your requests </h2>
        <h3 className="mb-4"> [{amountOfReplies}] </h3>
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
              return <ReplyTile message={message} key={index} />;
            })}
          </div>
        )}
        <div
          hidden={amountOfReplies !== 0 ? false : true}
          className="text-right mt-4 pr-2"
        >
          <Link to={"/"}>
            <button className="btn btn-sm mt-4 smallWidth form-control">
              Go back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RepliesPage;
