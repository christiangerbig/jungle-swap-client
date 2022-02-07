import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const NavLoggedInUserItems = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isNewRequest = useAppSelector(
    (state: RootState) => state.jungleSwap.isNewRequest
  );
  const isNewReply = useAppSelector(
    (state: RootState) => state.jungleSwap.isNewReply
  );

  return (
    <>
      <Link to="/plants/my" className="p-2">
        My Plants
      </Link>
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
      <Link
        to="/auth/log-out"
        title={loggedInUser ? loggedInUser.username : ""}
        className="p-2"
      >
        Log out
      </Link>
    </>
  );
};

export default NavLoggedInUserItems;
