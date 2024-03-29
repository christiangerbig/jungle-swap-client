import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useMessage } from "../../app/custom-hooks/useMessage";
import { useIntervalCounter } from "../../app/custom-hooks/useIntervalCounter";
import { animateScroll as scroll } from "react-scroll";
import { Navbar, Nav } from "react-bootstrap";
import {
  setIsUserChange,
  setIntervalId,
  increaseDelayCounter,
  setStartAmountOfRequests,
  setStartAmountOfReplies,
  scrollToPlants,
  selectIsUserChange,
  selectLoggedInUser,
  selectIntervalId,
  selectDelayCounter,
  selectIsNewRequest,
  selectIsNewReply,
  selectAmountOfRequests,
  selectAmountOfReplies,
} from "../../reducer/jungleSwapSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Message, User } from "../../app/typeDefinitions";
import NavAdditionalItems from "./NavAdditionalItems";
import SelectLanguage from "../helpers/SelectLanguage";

const NavBar = (): JSX.Element => {
  const isUserChange = useAppSelector(selectIsUserChange);
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const intervalId = useAppSelector(selectIntervalId);
  const delayCounter = useAppSelector(selectDelayCounter);
  const isNewRequest = useAppSelector(selectIsNewRequest);
  const isNewReply = useAppSelector(selectIsNewReply);
  const amountOfRequests = useAppSelector(selectAmountOfRequests);
  const amountOfReplies = useAppSelector(selectAmountOfReplies);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { fetchMessages, fetchCheck, checkNewRequests, checkNewReplies } =
    useMessage();
  const { stopCounter } = useIntervalCounter();
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
        checkNewRequests(loggedInUser as User, messages, amountOfRequests);
        checkNewReplies(loggedInUser as User, messages, amountOfReplies);
      });
    };

    if (isUserChange) {
      dispatch(setStartAmountOfRequests());
      dispatch(setStartAmountOfReplies());
    }
    loggedInUser && checkNewRequestsReplies();
  }, [delayCounter]);

  const tooltipItemSearch = (): string => t("link.tooltipps.search");

  return (
    <div>
      <Navbar
        variant="dark"
        expand="lg"
        fixed="top"
        className="[ nav-bar ] [ px-5 ]"
      >
        <Navbar.Brand>
          <Link to="/" className="nav-bar__nav-link" onClick={scrollToTop}>
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
              className="[ nav-bar__nav-link ] [ p-2 ]"
              onClick={(): void => {
                dispatch(scrollToPlants());
              }}
            >
              {t("link.allPlants")}
            </Link>
            <NavAdditionalItems user={loggedInUser} />
            <Link to="/faq" className="[ nav-bar__nav-link ] [ p-2 ]">
              {t("link.faq")}
            </Link>
            <Link
              to="/"
              title={tooltipItemSearch()}
              className="[ nav-bar__nav-link ] [ p-2 ]"
              onClick={(): void => {
                dispatch(scrollToPlants());
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </Link>
          </Nav>
          <SelectLanguage />
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
