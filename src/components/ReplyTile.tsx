import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { User, Plant, Message } from "../typeDefinitions";
import { RootState } from "../store";

type ReplyThumbnailProps = {
  message: Message;
};

const ReplyThumbnail = ({ message }: ReplyThumbnailProps): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const { _id, buyer, seller, plant, reply } = message;
  const { name } = plant as Plant;
  const { username } = seller as User;

  return (
    <div
      hidden={
        (buyer as User)._id === (loggedInUser as User)._id && reply !== ""
          ? false
          : true
      }
      className="card p-3 mt-4 "
    >
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
