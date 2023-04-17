import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Plant, Message } from "../../app/typeDefinitions";

interface ReplyThumbnailProps {
  message: Message;
}

const ReplyThumbnail = ({
  message: { _id, seller, plant },
}: ReplyThumbnailProps): JSX.Element => {
  const { name } = plant as Plant;
  const { username } = seller as User;
  const { t } = useTranslation();

  return (
    <div className="card p-3 mt-4 ">
      <h4>
        {t("texts.replies.replyTile.headline")} "{name}"
      </h4>
      <h5>
        {t("texts.replies.replyTile.subheadline")} {username}
      </h5>
      <div className="text-center">
        <Link to={`/replies/fetch/${_id}`} className="navigation-link">
          <button className="[ button button--width-small ] [ btn form-control ]">
            {t("link.details")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ReplyThumbnail;
