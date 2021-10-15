import { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import {
  fetchAllMessages,
  setIsNewReply,
  User,
  Plant,
  Message,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const RepliesPage = (): JSX.Element => {
  const loggedInUser = useSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUserChange = useSelector(
    (state: RootState) => state.jungleSwap.isUserChange
  );
  const messages = useSelector((state: RootState) => state.jungleSwap.messages);
  const amountOfReplies = useSelector(
    (state: RootState) => state.jungleSwap.amountOfReplies
  );
  const dispatch = useDispatch();

  // Fetch all requests and reset values as soon as page loads and reset values during cleanup
  useEffect(() => {
    const handleResetAll = (): void => {
      dispatch(setIsNewReply(false));
      scroll.scrollToTop();
    };

    dispatch(fetchAllMessages(isUserChange));
    handleResetAll();
    return () => handleResetAll();
  }, []);

  if (!loggedInUser) return <Redirect to={"/signup"} />;

  if (!messages)
    return (
      <div className="spinner-grow text-success m-5" role="status">
        <span className="visually-hidden">
          <br /> <br /> Loading replies...
        </span>
      </div>
    );

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2> Replies for your requests </h2>
        <h3 className="mb-4"> [{amountOfReplies}] </h3>
        <div className="text-right pr-2">
          <Link to={"/"}>
            <button className="btn btn-sm mt-4 smallWidth form-control">
              Go back
            </button>
          </Link>
        </div>
        {messages.map(
          ({
            _id,
            buyer,
            seller,
            plant,
            reply,
          }: Message): false | "" | JSX.Element | undefined => {
            return (
              (buyer as User)._id === loggedInUser._id &&
              reply && (
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
              )
            );
          }
        )}
        {amountOfReplies !== 0 && (
          <div className="text-right mt-4 pr-2">
            <Link to={"/"}>
              <button className="btn btn-sm mt-4 smallWidth form-control">
                Go back
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepliesPage;
