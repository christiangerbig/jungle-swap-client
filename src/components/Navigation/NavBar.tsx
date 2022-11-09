import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useHandleMessage } from "../../app/custom-hooks/useHandleMessage";
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
import { Message } from "../../app/typeDefinitions";
import NavAdditionalItems from "./NavAdditionalItems";

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
  const { fetchMessages, fetchCheck, checkNewRequests, checkNewReplies } =
    useHandleMessage();
  const { stopCounter } = useIntervalCounter();
  const { t, i18n } = useTranslation();
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

  const handleSelectLanguage = ({ target: { value } }: any): void => {
    i18n.changeLanguage(value);
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
          <select
            className="form-select select-language"
            onChange={handleSelectLanguage}
          >
            <option disabled selected value="">
              {t("select.language.placeholder")}
            </option>
            <option value="de">{t("select.language.german")}</option>
            <option value="en">{t("select.language.english")}</option>
          </select>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
