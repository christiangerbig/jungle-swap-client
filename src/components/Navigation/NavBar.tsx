import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useHandleMessage } from "../../custom-hooks/useHandleMessage";
import { useIntervalCounter } from "../../custom-hooks/useIntervalCounter";
import { animateScroll as scroll } from "react-scroll";
import { Navbar, Nav } from "react-bootstrap";
import {
  setIsUserChange,
  setIntervalId,
  increaseDelayCounter,
  setStartAmountOfRequests,
  setStartAmountOfReplies,
  scrollToPlants,
} from "../../reducer/jungleSwapSlice";
import { RootState } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Message } from "../../typeDefinitions";
import NavAdditionalItems from "./NavAdditionalItems";

const NavBar = (): JSX.Element => {
  const isUserChange = useAppSelector(
    (state: RootState) => state.jungleSwap.isUserChange
  );
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const intervalId = useAppSelector(
    (state: RootState) => state.jungleSwap.intervalId
  );
  const delayCounter = useAppSelector(
    (state: RootState) => state.jungleSwap.delayCounter
  );
  const isNewRequest = useAppSelector(
    (state: RootState) => state.jungleSwap.isNewRequest
  );
  const isNewReply = useAppSelector(
    (state: RootState) => state.jungleSwap.isNewReply
  );
  const amountOfRequests = useAppSelector(
    (state: RootState) => state.jungleSwap.amountOfRequests
  );
  const amountOfReplies = useAppSelector(
    (state: RootState) => state.jungleSwap.amountOfReplies
  );
  const dispatch = useAppDispatch();
  const { fetchMessages, fetchCheck, checkNewRequests, checkNewReplies } =
    useHandleMessage();
  const { stopCounter } = useIntervalCounter();
  const { t } = useTranslation();
  const { scrollToTop } = scroll;

  useEffect(() => {
    return () => {
      if (intervalId) {
        stopCounter(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    const startRequestsRepliesCheck = (): void => {
      const setInitialMessageVariables = (): void => {
        dispatch(setStartAmountOfRequests());
        dispatch(setStartAmountOfReplies());
        dispatch(setIsUserChange(false));
      };

      const startInterval = (): void => {
        const intervalId = setInterval(
          (): void => {
            dispatch(increaseDelayCounter());
          },
          1000 // every second
        );
        dispatch(setIntervalId(intervalId));
        dispatch(increaseDelayCounter());
      };

      fetchMessages((): void => {
        setInitialMessageVariables();
        startInterval();
      });
    };

    isUserChange && startRequestsRepliesCheck();
  }, [isUserChange]);

  useEffect(() => {
    const checkNewRequestsReplies = (): void => {
      fetchCheck((messages: Message[]): void => {
        checkNewRequests(loggedInUser, messages, amountOfRequests);
        checkNewReplies(loggedInUser, messages, amountOfReplies);
      });
    };

    if (isUserChange) {
      dispatch(setStartAmountOfRequests());
      dispatch(setStartAmountOfReplies());
    }
    loggedInUser && checkNewRequestsReplies();
  }, [delayCounter]);

  const tooltipItemSearch = (): string => {
    return t("link.tooltipps.search");
  };

  return (
    <div>
      <Navbar variant="dark" expand="lg" fixed="top" className="pl-5">
        <Navbar.Brand>
          <Link to="/" className="is-link" onClick={scrollToTop}>
            {t("link.jungleSwap")}
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          {(isNewRequest || isNewReply) && <FontAwesomeIcon icon={faBell} />}
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link
              to="/"
              className="p-2 is-link"
              onClick={(): void => {
                dispatch(scrollToPlants());
              }}
            >
              {t("link.allPlants")}
            </Link>
            <NavAdditionalItems user={loggedInUser} />
            <Link
              to="/"
              title={tooltipItemSearch()}
              className="p-2 is-link"
              onClick={(): void => {
                dispatch(scrollToPlants());
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
