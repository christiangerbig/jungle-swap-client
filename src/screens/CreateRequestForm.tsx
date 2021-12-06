import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsCreatingMessage,
  createMessage,
  addMessage,
  setErrorMessage,
} from "../reducer/jungleSwapSlice";
import { User, Plant, Message } from "../typeDefinitions";
import { RootState } from "../store";
import { protectRoute } from "../lib/utilities";

const CreateRequestForm = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const isCreatingMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.isCreatingMessage
  );
  const errorMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.errorMessage
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    protectRoute(dispatch);
    if (loggedInUser) {
      dispatch(setErrorMessage(null));
      scroll.scrollToTop();
    }
  }, []);

  const handleCreateMessageForRequest = (event: any, plant: Plant): void => {
    const addMessageAndReturnToPlantPage = (message: Message): void => {
      dispatch(addMessage(message));
      history.push(`/plants/fetch/${message.plant}`);
    };

    event.preventDefault();
    const { request } = event.target;
    const { _id, creator } = plant;
    const newMessage: Message = {
      seller: (creator as User)._id,
      plant: _id,
      request: request.value,
    };
    dispatch(setIsCreatingMessage(true));
    dispatch(createMessage(newMessage))
      .unwrap()
      .then((message) => {
        addMessageAndReturnToPlantPage(message);
      })
      .catch((rejectedValue: any) => {
        dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }
  const { _id, name } = plant as Plant;

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-4"> Your request </h2>
        <h3 className="mb-4"> for {name} </h3>
        <form
          className="pl-0"
          onSubmit={(event) => {
            handleCreateMessageForRequest(event, plant);
          }}
        >
          <div>
            <textarea
              name="request"
              cols={35}
              rows={7}
              className="mb-4 form-control"
            />
          </div>
          {errorMessage && <p className="warningColor"> {errorMessage} </p>}
          <div className="text-right">
            <button
              type="submit"
              disabled={isCreatingMessage ? true : false}
              className="btn btn-sm mx-2 form-control smallWidth"
            >
              Send
            </button>
            <Link to={`/plants/fetch/${_id}`}>
              <button className="btn btn-sm mx-2 form-control smallWidth">
                Go back
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestForm;
