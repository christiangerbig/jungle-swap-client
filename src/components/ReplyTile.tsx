import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Plant, Message } from "../typeDefinitions";

type ReplyThumbnailProps = {
  message: Message;
};

const ReplyThumbnail = ({ message }: ReplyThumbnailProps): JSX.Element => {
  const { _id, seller, plant } = message;
  const { name } = plant as Plant;
  const { username } = seller as User;
  const { t } = useTranslation();

  return (
    <div className="card p-3 mt-4 ">
      <h4>
        {t("replyTile.headline")} {name}
      </h4>
      <h5>
        {t("replyTile.subheadline")} {username}
      </h5>
      <div className="text-center">
        <Link
          to={`/replies/fetch/${_id}`}
          className="btn is-width-medium form-control is-link"
        >
          {t("link.details")}
        </Link>
      </div>
    </div>
  );
};

export default ReplyThumbnail;
