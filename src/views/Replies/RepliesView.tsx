import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { useHandleMessage } from "../../app/custom-hooks/useHandleMessage";
import {
  selectAmountOfReplies,
  selectiIsFetchingMessages,
  selectIsUserChange,
  selectLoggedInUser,
  setIsNewReply,
  setStartAmountOfReplies,
} from "../../reducer/jungleSwapSlice";
import WaitSpinner from "../../components/spinners/WaitSpinner";
import RepliesCollection from "../../components/replies/RepliesCollection";
import GoBackButton from "../../components/helpers/GoBackButton";

const RepliesView = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const isUserChange = useAppSelector(selectIsUserChange);
  const isFetchingMessages = useAppSelector(selectiIsFetchingMessages);
  const amountOfReplies = useAppSelector(selectAmountOfReplies);
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
