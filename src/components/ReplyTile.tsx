import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { Message, Plant, User } from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

type ReplyThumbnailProps = {
  message: Message;
};

const ReplyThumbnail = ({ message }: ReplyThumbnailProps): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const { _id, buyer, seller, plant, reply } = message;

  return (
    <>
      {loggedInUser && (buyer as User)._id === loggedInUser._id && reply && (
        <div className="card p-3 mt-4 " key={_id}>
          <h4> Reply for {(plant as Plant).name} </h4>
          <h5> by {(seller as User).username} </h5>
          <div className="text-center">
            <Link
              className="btn smallWidth form-control"
              to={`/replies/read/${_id}`}
            >
              Details
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default ReplyThumbnail;
