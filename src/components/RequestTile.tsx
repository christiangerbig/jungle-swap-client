import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { User, Message, Plant } from "../reducer/typeDefinitions";
import { RootState } from "../store";

type RequestThumbnailProps = {
  message: Message;
};

const RequestThumbnail = ({ message }: RequestThumbnailProps): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const { _id, buyer, seller, plant, messageState } = message;
  const { name } = plant as Plant;
  const { username } = buyer as User;

  return (
    <>
      {loggedInUser &&
        (seller as User)._id === loggedInUser._id &&
        messageState === true && (
          <div className="card p-3 mt-4" key={_id}>
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
        )}
    </>
  );
};

export default RequestThumbnail;
