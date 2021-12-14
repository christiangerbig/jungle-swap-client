import { Link } from "react-router-dom";
import { User, Message, Plant } from "../typeDefinitions";

type RequestThumbnailProps = {
  message: Message;
};

const RequestThumbnail = ({ message }: RequestThumbnailProps): JSX.Element => {
  const { _id, buyer, plant } = message;
  const { name } = plant as Plant;
  const { username } = buyer as User;

  return (
    <div className="card p-3 mt-4">
      <h4> Request for {name} </h4>
      <h5> by {username} </h5>
      <div className="text-center">
        <Link
          className="btn smallWidth form-control"
          to={`/requests/fetch/${_id}`}
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default RequestThumbnail;
