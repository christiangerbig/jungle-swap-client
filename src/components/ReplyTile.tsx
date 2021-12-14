import { Link } from "react-router-dom";
import { User, Plant, Message } from "../typeDefinitions";

type ReplyThumbnailProps = {
  message: Message;
};

const ReplyThumbnail = ({ message }: ReplyThumbnailProps): JSX.Element => {
  const { _id, seller, plant } = message;
  const { name } = plant as Plant;
  const { username } = seller as User;

  return (
    <div className="card p-3 mt-4 ">
      <h4> Reply for {name} </h4>
      <h5> by {username} </h5>
      <div className="text-center">
        <Link
          to={`/replies/fetch/${_id}`}
          className="btn smallWidth form-control"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default ReplyThumbnail;
