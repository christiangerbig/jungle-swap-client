import { useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsNewReply,
  setStartAmountOfReplies,
} from "../reducer/jungleSwapSlice";
import { Message, User } from "../typeDefinitions";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import { MessageIO } from "../lib/messageIO";
import ReplyTile from "../components/ReplyTile";
import WaitSpinner from "../components/WaitSpinner";

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
  const history = useHistory();

  useEffect(() => {
    const resetReplyVariableAndScrollToTop = (): void => {
      dispatch(setIsNewReply(false));
      scroll.scrollToTop();
    };

    const routing = new Routing(dispatch);
    routing.protect();
    if (loggedInUser) {
      const messageIO = new MessageIO(dispatch);
      messageIO.fetchAll();
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
          <button
            className="btn btn-sm mt-4 smallWidth form-control"
            onClick={() => {
              history.goBack();
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
              const { buyer, reply } = message;
              return (buyer as User)._id === (loggedInUser as User)._id &&
                reply !== "" ? (
                <ReplyTile message={message} key={index} />
              ) : (
                <></>
              );
            })}
          </div>
        )}
        {amountOfReplies !== 0 ? (
          <div className="text-right mt-4 pr-2">
            <button
              className="btn btn-sm mt-4 smallWidth form-control"
              onClick={() => {
                history.goBack();
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

export default RepliesPage;
