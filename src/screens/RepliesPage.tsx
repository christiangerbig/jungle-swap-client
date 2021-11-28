import { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  checkUserLoggedIn,
  setLoggedInUser,
  setIsFetchingMessages,
  fetchAllMessages,
  setMessages,
  setIsNewReply,
  setStartAmountOfReplies,
} from "../reducer/jungleSwapSlice";
import { Message } from "../typeDefinitions";
import { RootState } from "../store";
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

  // Fetch all messages, reset and update values as soon as page loads and reset values during cleanup if the user is logged  in
  useEffect(() => {
    // Reset values and scroll to top
    const resetValues = (): void => {
      dispatch(setIsNewReply(false));
      scroll.scrollToTop();
    };

    dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        dispatch(setIsFetchingMessages(true));
        dispatch(fetchAllMessages())
          .unwrap()
          .then((messages) => {
            dispatch(setMessages(messages));
            isUserChange && dispatch(setStartAmountOfReplies());
            resetValues();
          })
          .catch((rejectedValue: any) => {
            console.log(rejectedValue.message);
          });
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
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
        {amountOfReplies !== 0 && (
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

export default RepliesPage;
