import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { animateScroll as scroll } from "react-scroll";
import { Navbar, Nav } from "react-bootstrap";
import {
  setIsUserChange,
  setIsFetchingMessages,
  fetchAllMessages,
  setMessages,
  setIntervalId,
  increaseDelayCounter,
  setIsNewRequest,
  setIsNewReply,
  setStartAmountOfRequests,
  setStartAmountOfReplies,
  setAmountOfRequests,
  setAmountOfReplies,
  scrollToPlants,
} from "../reducer/jungleSwapSlice";
import { User, Message } from "../typeDefinitions";
import { RootState } from "../store";
import { stopIntervalCounter } from "../lib/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch } from "@fortawesome/free-solid-svg-icons";

const NavBar = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUserChange = useAppSelector(
    (state: RootState) => state.jungleSwap.isUserChange
  );
  const intervalId = useAppSelector(
    (state: RootState) => state.jungleSwap.intervalId
  );
  const delayCounter = useAppSelector(
    (state: RootState) => state.jungleSwap.delayCounter
  );
  const amountOfRequests = useAppSelector(
    (state: RootState) => state.jungleSwap.amountOfRequests
  );
  const amountOfReplies = useAppSelector(
    (state: RootState) => state.jungleSwap.amountOfReplies
  );
  const isNewRequest = useAppSelector(
    (state: RootState) => state.jungleSwap.isNewRequest
  );
  const isNewReply = useAppSelector(
    (state: RootState) => state.jungleSwap.isNewReply
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Stop interval at cleanup
    return () => {
      intervalId && stopIntervalCounter(intervalId, dispatch);
    };
  }, []);

  // Start request/reply check if user changes
  useEffect(() => {
    // Start request/reply check
    const startRequestAndReplyCheck = (): void => {
      dispatch(setIsFetchingMessages(true));
      dispatch(fetchAllMessages())
        .unwrap()
        .then((messages) => {
          dispatch(setMessages(messages));
          dispatch(setStartAmountOfRequests());
          dispatch(setStartAmountOfReplies());
          dispatch(setIsUserChange(false));
          dispatch(
            setIntervalId(
              setInterval(
                () => {
                  dispatch(increaseDelayCounter());
                },
                1000 // every second
              )
            )
          );
          dispatch(increaseDelayCounter());
        })
        .catch((rejectedValue: any) => {
          console.log(rejectedValue.message);
        });
    };

    isUserChange && startRequestAndReplyCheck();
  }, [isUserChange]);

  // Check for new requests/replies every second if user is logged in
  useEffect(() => {
    // Check if there are new requests
    const checkAmountOfRequests = (messages: Message[]): void => {
      const currentAmountOfRequests = messages.filter(
        (message: Message): boolean => {
          const { seller, messageState } = message;
          return (
            (seller as User)._id === (loggedInUser as User)._id &&
            messageState === true
          );
        }
      ).length;
      if (amountOfRequests < currentAmountOfRequests) {
        dispatch(setAmountOfRequests(currentAmountOfRequests));
        dispatch(setIsNewRequest(true));
      } else if (amountOfRequests > currentAmountOfRequests) {
        dispatch(setAmountOfRequests(currentAmountOfRequests));
      }
    };

    // Check if there are new replies
    const checkAmountOfReplies = (messages: Message[]): void => {
      const currentAmountOfReplies = messages.filter(
        (message: Message): boolean => {
          const { buyer, reply } = message;
          return (
            (buyer as User)._id === (loggedInUser as User)._id && reply !== ""
          );
        }
      ).length;
      if (amountOfReplies < currentAmountOfReplies) {
        dispatch(setAmountOfReplies(currentAmountOfReplies));
        dispatch(setIsNewReply(true));
      } else if (amountOfReplies > currentAmountOfReplies) {
        dispatch(setAmountOfReplies(currentAmountOfReplies));
      }
    };

    // Check and update amount of new requests/replies
    const checkNewRequestsAndReplies = (isUserChange: boolean): void => {
      dispatch(fetchAllMessages())
        .unwrap()
        .then((messages) => {
          dispatch(setMessages(messages));
          isUserChange && dispatch(setStartAmountOfRequests());
          isUserChange && dispatch(setStartAmountOfReplies());
          checkAmountOfRequests(messages);
          checkAmountOfReplies(messages);
        })
        .catch((rejectedValue: any) => {
          console.log(rejectedValue.message);
        });
    };

    loggedInUser && checkNewRequestsAndReplies(isUserChange);
  }, [delayCounter]);

  return (
    <div>
      <Navbar className="pl-5" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand>
          <Link to="/" onClick={scroll.scrollToTop}>
            JungleSwap
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          {(isNewRequest || isNewReply) && <FontAwesomeIcon icon={faBell} />}
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <>
              <Link
                to="/"
                className="p-2"
                onClick={() => {
                  dispatch(scrollToPlants());
                }}
              >
                All Plants
              </Link>
            </>
            {loggedInUser && (
              <>
                <Link className="p-2" to="/plants/create">
                  Create Plant
                </Link>
                <Link
                  className="p-2"
                  to="/requests/fetch-all"
                  title={isNewRequest ? "new request" : ""}
                >
                  {isNewRequest && <FontAwesomeIcon icon={faBell} />}
                  Requests
                </Link>
                <Link
                  className="p-2"
                  to="/replies/fetch-all"
                  title={isNewReply ? "new reply" : ""}
                >
                  {isNewReply && <FontAwesomeIcon icon={faBell} />}
                  Replies
                </Link>
              </>
            )}
            {loggedInUser ? (
              <>
                <Link
                  className="p-2"
                  to="/auth/log-out"
                  title={loggedInUser.username}
                >
                  Log out
                </Link>
              </>
            ) : (
              <>
                <Link className="p-2" to="/auth/sign-in">
                  Sign in
                </Link>
                <Link className="p-2" to="/auth/sign-up">
                  Sign up
                </Link>
              </>
            )}
            <>
              <Link
                to="/"
                className="p-2"
                onClick={() => {
                  dispatch(scrollToPlants());
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </Link>
            </>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
