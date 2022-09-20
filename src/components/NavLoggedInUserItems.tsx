import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const loggedInUserTitle = () => {
    return loggedInUser ? loggedInUser.username : "";
  };

  return (
    <>
      <Link to="/plants/my-own" className="p-2 is-link">
        {t("link.myPlants")}
      </Link>
      <Link to="/plants/create" className="p-2 is-link">
        {t("link.createPlant")}
      </Link>
      <Link
        to="/requests/fetch-all"
        title={isNewRequest ? "new request" : ""}
        className="p-2 is-link"
      >
        {isNewRequest && <FontAwesomeIcon icon={faBell} />}
        {t("link.requests")}
      </Link>
      <Link
        to="/replies/fetch-all"
        title={isNewReply ? "new reply" : ""}
        className="p-2 is-link"
      >
        {isNewReply && <FontAwesomeIcon icon={faBell} />}
        {t("link.replies")}
      </Link>
      <Link
        to="/auth/log-out"
        title={loggedInUserTitle()}
        className="p-2 is-link"
      >
        {t("link.logOut")}
      </Link>
    </>
  );
};

export default NavLoggedInUserItems;
