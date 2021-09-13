import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { Navbar, Nav } from "react-bootstrap";
import {
  fetchAllRequests,
  setIsUserChange,
  setIntervalId,
  increaseMinutesCounter,
  setMinutesCounter,
  setAmountOfRequests,
  setIsNewRequest,
  scrollToPlants,
  User,
  Request,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const NavBar = () => {
  const loggedInUser = useSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUserChange = useSelector(
    (state: RootState) => state.jungleSwap.isUserChange
  );
  const requests = useSelector((state: RootState) => state.jungleSwap.requests);
  const isNewRequest = useSelector(
    (state: RootState) => state.jungleSwap.isNewRequest
  );
  const intervalId = useSelector(
    (state: RootState) => state.jungleSwap.intervalId
  );
  const minutesCounter = useSelector(
    (state: RootState) => state.jungleSwap.minutesCounter
  );
  const amountOfRequests = useSelector(
    (state: RootState) => state.jungleSwap.amountOfRequests
  );
  const dispatch = useDispatch();

  // Stop interval at cleanup
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        dispatch(setIntervalId(null));
        dispatch(setMinutesCounter(0));
      }
    };
  }, []);

  // Start request check if user changes
  useEffect(() => {
    if (isUserChange) {
      dispatch(fetchAllRequests(isUserChange));
      dispatch(setIsUserChange(false));
      dispatch(
        setIntervalId(
          setInterval(
            () => dispatch(increaseMinutesCounter()),
            10000 // every minute
          )
        )
      );
    }
  }, [isUserChange]);

  // Check new requests for logged in user every minute
  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchAllRequests(isUserChange));
      const currentAmountOfRequests = requests.filter(
        (currentRequest: Request) => {
          const { seller } = currentRequest;
          return (seller as User)._id === loggedInUser._id;
        }
      ).length;
      if (amountOfRequests < currentAmountOfRequests) {
        dispatch(setAmountOfRequests(currentAmountOfRequests));
        dispatch(setIsNewRequest(true));
      }
    }
  }, [minutesCounter]);

  return (
    <div>
      <Navbar className="pl-5" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand>
          <Link to="/" onClick={scroll.scrollToTop}>
            JungleSwap
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <div>
              <Link
                to="/"
                className="p-2"
                onClick={() => dispatch(scrollToPlants())}
              >
                All Plants
              </Link>
            </div>
            {loggedInUser && (
              <div>
                <Link className="p-2" to="/plants/create">
                  Create Plant
                </Link>
                <Link
                  className={isNewRequest ? "p-2 alertColor" : "p-2"}
                  to="/requests/fetch"
                  title={isNewRequest ? "new message" : ""}
                >
                  Messages
                </Link>
              </div>
            )}
            {loggedInUser ? (
              <div>
                <Link
                  className="p-2"
                  to="/logout"
                  title={loggedInUser.username}
                >
                  Log out
                </Link>
              </div>
            ) : (
              <div>
                <Link className="p-2" to="/signin">
                  Sign in
                </Link>
                <Link className="p-2" to="/signup">
                  Sign up
                </Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
