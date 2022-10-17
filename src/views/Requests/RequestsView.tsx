import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useRouting } from "../../custom-hooks/useRouting";
import { useHandleMessage } from "../../custom-hooks/useHandleMessage";
import {
  setIsNewRequest,
  setStartAmountOfRequests,
} from "../../reducer/jungleSwapSlice";
import { RootState } from "../../store";
import WaitSpinner from "../../components/spinners/WaitSpinner";
import RequestsCollection from "../../components/requests/RequestsCollection";
import GoBackButton from "../../components/helpers/GoBackButton";

const RequestsView = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUserChange = useAppSelector(
    (state: RootState) => state.jungleSwap.isUserChange
  );
  const isFetchingMessages = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingMessages
  );
  const amountOfRequests = useAppSelector(
    (state: RootState) => state.jungleSwap.amountOfRequests
  );
  const dispatch = useAppDispatch();
  const routing = useRouting();
  const handleMessage = useHandleMessage();
  const { t } = useTranslation();

  useEffect(() => {
    const resetRequestVariableAndScrollToTop = (): void => {
      dispatch(setIsNewRequest(false));
      scroll.scrollToTop();
    };

    routing.protect((): void => {
      handleMessage.fetchAll((): void => {
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
