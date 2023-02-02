import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../app/hooks";
import {
  selectIsNewReply,
  selectIsNewRequest,
  selectLoggedInUser,
} from "../../reducer/jungleSwapSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const NavUserItems = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const isNewRequest = useAppSelector(selectIsNewRequest);
  const isNewReply = useAppSelector(selectIsNewReply);
  const { t } = useTranslation();

  const tooltipItemRequests = (): string =>
    isNewRequest ? t("link.tooltipps.newRequest") : "";

  const tooltipItemReplies = (): string =>
    isNewReply ? t("link.tooltipps.newReply") : "";

  const tooltipItemLogOut = (): string | undefined =>
    loggedInUser ? loggedInUser.username : "";

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
        title={tooltipItemRequests()}
        className="p-2 is-link"
      >
        {isNewRequest && <FontAwesomeIcon icon={faBell} />}
        {t("link.requests")}
      </Link>
      <Link
        to="/replies/fetch-all"
        title={tooltipItemReplies()}
        className="p-2 is-link"
      >
        {isNewReply && <FontAwesomeIcon icon={faBell} />}
        {t("link.replies")}
      </Link>
      <Link
        to="/auth/log-out"
        title={tooltipItemLogOut()}
        className="p-2 is-link"
      >
        {t("link.logOut")}
      </Link>
    </>
  );
};

export default NavUserItems;
