import { useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsNewReply,
  setStartAmountOfReplies,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import { MessageIO } from "../lib/messageIO";
import WaitSpinner from "../components/WaitSpinner";
import RepliesCollection from "../components/RepliesCollection";
import { MainPageScrolling } from "../lib/MainPageScrolling";

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

  const handleGoBack = () => {
    const pageScrolling = new MainPageScrolling(history);
    pageScrolling.toTop();
  };

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
              history.push("/");
              scroll.scrollToTop();
            }}
          >
            Go back
          </button>
        </div>
        {isFetchingMessages ? <WaitSpinner /> : <RepliesCollection />}
        {amountOfReplies !== 0 ? (
          <div className="text-right mt-4 pr-2">
            <button
              className="btn btn-sm mt-4 smallWidth form-control"
              onClick={handleGoBack}
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
