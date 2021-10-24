import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { animateScroll as scroll } from "react-scroll";
import { Navbar, Nav } from "react-bootstrap";
import {
  fetchAllMessages,
  setIsUserChange,
  setIntervalId,
  increaseDelayCounter,
  setDelayCounter,
  setAmountOfRequests,
  setAmountOfReplies,
  setIsNewRequest,
  setIsNewReply,
  scrollToPlants,
  User,
  Message,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUserChange = useAppSelector(
    (state: RootState) => state.jungleSwap.isUserChange
  );
  const messages = useAppSelector((state: RootState) => state.jungleSwap.messages);
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

  // Stop interval at cleanup
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        dispatch(setIntervalId(null));
        dispatch(setDelayCounter(0));
      }
    };
  }, []);

  // Start request/reply check if user changes
  useEffect(() => {
    if (isUserChange) {
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
    }
  }, [isUserChange]);

  // Check new requests/replies for logged in user every minute
  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchAllMessages(isUserChange));
      const currentAmountOfRequests = messages.filter((message: Message) => {
        const { seller, messageState } = message;
        return (
          (seller as User)._id === loggedInUser._id && messageState === true
        );
      }).length;
      if (amountOfRequests < currentAmountOfRequests) {
        dispatch(setAmountOfRequests(currentAmountOfRequests));
        dispatch(setIsNewRequest(true));
      } else if (amountOfRequests > currentAmountOfRequests) {
        dispatch(setAmountOfRequests(currentAmountOfRequests));
      }
      const currentAmountOfReplies = messages.filter((message: Message) => {
        const { buyer, reply } = message;
        return (buyer as User)._id === loggedInUser._id && reply;
      }).length;
      if (amountOfReplies < currentAmountOfReplies) {
        dispatch(setAmountOfReplies(currentAmountOfReplies));
        dispatch(setIsNewReply(true));
      }
    }
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
                  to="/requests/fetch"
                  title={isNewRequest ? "new request" : ""}
                >
                  {isNewRequest && <FontAwesomeIcon icon={faBell} />}
                  Requests
                </Link>
                <Link
                  className="p-2"
                  to="/replies/fetch"
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
                  to="/logout"
                  title={loggedInUser.username}
                >
                  Log out
                </Link>
              </>
            ) : (
              <>
                <Link className="p-2" to="/signin">
                  Sign in
                </Link>
                <Link className="p-2" to="/signup">
                  Sign up
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
