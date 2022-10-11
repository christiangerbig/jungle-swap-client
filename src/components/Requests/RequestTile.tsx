import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Message, Plant } from "../../typeDefinitions";

type RequestThumbnailProps = {
  message: Message;
};

const RequestThumbnail = ({ message }: RequestThumbnailProps): JSX.Element => {
  const { _id, buyer, plant } = message;
  const { name } = plant as Plant;
  const { username } = buyer as User;
  const { t } = useTranslation();

  return (
    <div className="card p-3 mt-4">
      <h4>
        {t("texts.requests.requestTile.subheadline")} {name}
      </h4>
      <h5>{username}</h5>
      <div className="text-center">
        <Link
          to={`/requests/fetch/${_id}`}
          className="btn is-width-medium form-control is-link"
        >
          {t("link.details")}
        </Link>
      </div>
    </div>
  );
};

export default RequestThumbnail;
