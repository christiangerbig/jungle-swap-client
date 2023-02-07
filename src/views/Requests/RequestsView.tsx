import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useRouting } from "../../app/custom-hooks/useRouting";
import { useMessage } from "../../app/custom-hooks/useMessage";
import {
  selectAmountOfRequests,
  selectiIsFetchingMessages,
  selectIsUserChange,
  selectLoggedInUser,
  setIsNewRequest,
  setStartAmountOfRequests,
} from "../../reducer/jungleSwapSlice";
import WaitSpinner from "../../components/spinners/WaitSpinner";
import RequestsCollection from "../../components/requests/RequestsCollection";
import GoBackButton from "../../components/helpers/GoBackButton";

const RequestsView = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const isUserChange = useAppSelector(selectIsUserChange);
  const isFetchingMessages = useAppSelector(selectiIsFetchingMessages);
  const amountOfRequests = useAppSelector(selectAmountOfRequests);
  const dispatch = useAppDispatch();
  const { protectRoute } = useRouting();
  const { fetchMessages } = useMessage();
  const { t } = useTranslation();
  const { scrollToTop } = scroll;

  useEffect(() => {
    const resetRequestVariableAndScrollToTop = (): void => {
      dispatch(setIsNewRequest(false));
      scrollToTop();
    };

    protectRoute((): void => {
      fetchMessages((): void => {
        isUserChange && dispatch(setStartAmountOfRequests());
        resetRequestVariableAndScrollToTop();
      });
    });
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
        <h2>{t("texts.requests.overview.headline")}</h2>
        <h3 className="mb-4"> [{amountOfRequests}] </h3>
        <GoBackButton />
        {isFetchingMessages ? <WaitSpinner /> : <RequestsCollection />}
        {amountOfRequests !== 0 && <GoBackButton />}
      </div>
    </div>
  );
};

export default RequestsView;
