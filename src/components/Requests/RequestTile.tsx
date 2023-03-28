import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Message, Plant } from "../../app/typeDefinitions";

interface RequestThumbnailProps {
  message: Message;
}

const RequestTile = ({
  message: { _id, buyer, plant },
}: RequestThumbnailProps): JSX.Element => {
  const { t } = useTranslation();
  const { name } = (plant as Plant) || {};
  const { username } = buyer as User;

  return (
    <div className="card p-3 mt-4">
      <h4>
        {t("texts.requests.requestTile.headline")} {name}
      </h4>
      <h5>
        {t("texts.requests.requestTile.subheadline")} {username}
      </h5>
      <div className="text-center">
        <Link to={`/requests/fetch/${_id}`} className="navigation-link">
          <button className="[ button--width-small ] [ btn form-control ]">
            {t("link.details")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RequestTile;
