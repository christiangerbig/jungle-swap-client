import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsNewRequest,
  setStartAmountOfRequests,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import { MessageIO } from "../lib/messageIO";
import WaitSpinner from "../components/WaitSpinner";
import RequestsOverview from "../components/RequestsOverview";
import GoBackButton from "../components/GoBackButton";

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
  const amountOfRequests = useAppSelector(
    (state: RootState) => state.jungleSwap.amountOfRequests
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const resetRequestVariableAndScrollToTop = (): void => {
      dispatch(setIsNewRequest(false));
      scroll.scrollToTop();
    };

    const routing = new Routing(dispatch);
    routing.protect((): void => {
      const messageIO = new MessageIO(dispatch);
      messageIO.fetchAll((): void => {
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
        <h2>{t("requestsPage.headline")}</h2>
        <h3 className="mb-4"> [{amountOfRequests}] </h3>
        <GoBackButton />
        {isFetchingMessages ? <WaitSpinner /> : <RequestsOverview />}
        {amountOfRequests !== 0 ? <GoBackButton /> : null}
      </div>
    </div>
  );
};

export default RequestsPage;
