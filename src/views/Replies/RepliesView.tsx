import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useRouting } from "../../custom-hooks/useRouting";
import {
  setIsNewReply,
  setStartAmountOfReplies,
} from "../../reducer/jungleSwapSlice";
import { RootState } from "../../store";
import WaitSpinner from "../../components/spinners/WaitSpinner";
import RepliesCollection from "../../components/replies/RepliesCollection";
import GoBackButton from "../../components/helpers/GoBackButton";
import { useHandleMessage } from "../../custom-hooks/useHandleMessage";

const RepliesView = (): JSX.Element => {
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
  const { protectRoute } = useRouting();
  const { fetchMessages } = useHandleMessage();
  const { t } = useTranslation();
  const { scrollToTop } = scroll;

  useEffect(() => {
    const resetReplyVariableAndScrollToTop = (): void => {
      dispatch(setIsNewReply(false));
      scrollToTop();
    };

    protectRoute((): void => {
      fetchMessages((): void => {
        isUserChange && dispatch(setStartAmountOfReplies());
        resetReplyVariableAndScrollToTop();
      });
    });
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
        <h2>{t("texts.replies.overview.headline")}</h2>
        <h3 className="mb-4"> [{amountOfReplies}] </h3>
        <GoBackButton />
        {isFetchingMessages ? <WaitSpinner /> : <RepliesCollection />}
        {amountOfReplies !== 0 && <GoBackButton />}
      </div>
    </div>
  );
};

export default RepliesView;
