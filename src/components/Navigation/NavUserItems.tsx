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
      <Link
        to="/plants/my-own"
        className="[ nav-user-items__nav-link ] [ p-2 ]"
      >
        {t("link.myPlants")}
      </Link>
      <Link
        to="/plants/create"
        className="[ nav-user-items__nav-link ] [ p-2 ]"
      >
        {t("link.createPlant")}
      </Link>
      <Link
        to="/requests/fetch-all"
        title={tooltipItemRequests()}
        className="[ nav-user-items__nav-link ] [ p-2 ]"
      >
        {isNewRequest && <FontAwesomeIcon icon={faBell} />}
        {t("link.requests")}
      </Link>
      <Link
        to="/replies/fetch-all"
        title={tooltipItemReplies()}
        className="[ nav-user-items__nav-link ] [ p-2 ]"
      >
        {isNewReply && <FontAwesomeIcon icon={faBell} />}
        {t("link.replies")}
      </Link>
      <Link
        to="/auth/log-out"
        title={tooltipItemLogOut()}
        className="[ nav-user-items__nav-link ] [ p-2 ]"
      >
        {t("link.logOut")}
      </Link>
    </>
  );
};

export default NavUserItems;
