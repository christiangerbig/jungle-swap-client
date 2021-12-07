import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { animateScroll as scroll } from "react-scroll";
import { Navbar, Nav } from "react-bootstrap";
import {
  setIsUserChange,
  setIntervalId,
  increaseDelayCounter,
  setIsNewRequest,
  setIsNewReply,
  setStartAmountOfRequests,
  setStartAmountOfReplies,
  setAmountOfRequests,
  setAmountOfReplies,
  scrollToPlants,
  setMessages,
  setIsFetchingMessages,
  fetchAllMessages,
} from "../reducer/jungleSwapSlice";
import { User, Message } from "../typeDefinitions";
import { RootState } from "../store";
import { stopIntervalCounter } from "../lib/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch } from "@fortawesome/free-solid-svg-icons";

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

  useEffect(() => {
    return () => {
      intervalId && stopIntervalCounter(intervalId, dispatch);
    };
  }, []);

  useEffect(() => {
    const fetchMessagesAndStartRequestsRepliesCheck = (): void => {
      const setMessageVariablesAndStartInterval = (
        messages: Message[]
      ): void => {
        const setMessageVariables = (messages: Message[]): void => {
          dispatch(setMessages(messages));
          dispatch(setStartAmountOfRequests());
          dispatch(setStartAmountOfReplies());
          dispatch(setIsUserChange(false));
        };

        const startInterval = (): void => {
          const intervalId = setInterval(
            () => {
              dispatch(increaseDelayCounter());
            },
            1000 // every second
          );
          dispatch(setIntervalId(intervalId));
          dispatch(increaseDelayCounter());
        };

        setMessageVariables(messages);
        startInterval();
      };

      dispatch(setIsFetchingMessages(true));
      dispatch(fetchAllMessages())
        .unwrap()
        .then((messages: Message[]) => {
          setMessageVariablesAndStartInterval(messages);
        })
        .catch((rejectedValue: any) => {
          console.log(rejectedValue.message);
        });
    };

    isUserChange && fetchMessagesAndStartRequestsRepliesCheck();
  }, [isUserChange]);

  useEffect(() => {
    const fetchMessagesAndCheckNewRequestsReplies = (): void => {
      const setMessagesVariableAndCheckNewRequestsReplies = (
        messages: Message[]
      ): void => {
        const checkNewRequests = (messages: Message[]): void => {
          const getAmountOfRequests = (messages: Message[]): number => {
            const currentAmountOfRequests = messages.filter(
              (message: Message): boolean => {
                const { seller, messageState } = message;
                return (
                  (seller as User)._id === (loggedInUser as User)._id &&
                  messageState === true
                );
              }
            ).length;
            return currentAmountOfRequests;
          };

          const checkAmountOfRequests = (
            currentAmountOfRequests: number,
            amountOfRequests: number
          ): void => {
            if (amountOfRequests < currentAmountOfRequests) {
              dispatch(setIsNewRequest(true));
            }
            if (amountOfRequests !== currentAmountOfRequests) {
              dispatch(setAmountOfRequests(currentAmountOfRequests));
            }
          };

          const currentAmountOfRequests = getAmountOfRequests(messages);
          checkAmountOfRequests(currentAmountOfRequests, amountOfRequests);
        };

        const checkNewReplies = (messages: Message[]): void => {
          const getAmountOfReplies = (messages: Message[]): number => {
            const currentAmountOfReplies = messages.filter(
              (message: Message): boolean => {
                const { buyer, reply } = message;
                return (
                  (buyer as User)._id === (loggedInUser as User)._id &&
                  reply !== ""
                );
              }
            ).length;
            return currentAmountOfReplies;
          };

          const checkAmountOfReplies = (
            currentAmountOfReplies: number,
            amountOfReplies: number
          ): void => {
            if (amountOfReplies < currentAmountOfReplies) {
              dispatch(setIsNewReply(true));
            }
            if (amountOfReplies !== currentAmountOfReplies) {
              dispatch(setAmountOfReplies(currentAmountOfReplies));
            }
          };

          const currentAmountOfReplies = getAmountOfReplies(messages);
          checkAmountOfReplies(currentAmountOfReplies, amountOfReplies);
        };

        dispatch(setMessages(messages));
        checkNewRequests(messages);
        checkNewReplies(messages);
      };

      dispatch(fetchAllMessages())
        .unwrap()
        .then((messages: Message[]) => {
          setMessagesVariableAndCheckNewRequestsReplies(messages);
        })
        .catch((rejectedValue: any) => {
          console.log(rejectedValue.message);
        });
    };

    if (isUserChange) {
      dispatch(setStartAmountOfRequests());
      dispatch(setStartAmountOfReplies());
    }
    loggedInUser && fetchMessagesAndCheckNewRequestsReplies();
  }, [delayCounter]);

  return (
    <div>
      <Navbar variant="dark" expand="lg" fixed="top" className="pl-5">
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
                <Link to="/plants/create" className="p-2">
                  Create Plant
                </Link>
                <Link
                  to="/requests/fetch-all"
                  title={isNewRequest ? "new request" : ""}
                  className="p-2"
                >
                  {isNewRequest && <FontAwesomeIcon icon={faBell} />}
                  Requests
                </Link>
                <Link
                  to="/replies/fetch-all"
                  title={isNewReply ? "new reply" : ""}
                  className="p-2"
                >
                  {isNewReply && <FontAwesomeIcon icon={faBell} />}
                  Replies
                </Link>
              </>
            )}
            {loggedInUser ? (
              <>
                <Link
                  to="/auth/log-out"
                  title={loggedInUser.username}
                  className="p-2"
                >
                  Log out
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth/sign-in" className="p-2">
                  Sign in
                </Link>
                <Link to="/auth/sign-up" className="p-2">
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
