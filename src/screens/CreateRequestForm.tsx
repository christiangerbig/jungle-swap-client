import { useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
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
import { Routing } from "../lib/routing";

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
    const routing = new Routing(dispatch);
    routing.protect();
    if (loggedInUser) {
      dispatch(setErrorMessage(null));
      scroll.scrollToTop();
    }
  }, []);

  const handleCreateMessageForRequest = (
    event: React.FormEvent<HTMLFormElement>,
    plant: Plant
  ): void => {
    const addMessageAndReturnToPlantDetailsPage = (message: Message): void => {
      dispatch(addMessage(message));
      history.goBack();
    };

    event.preventDefault();
    const { request } = event.target as any;
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
        addMessageAndReturnToPlantDetailsPage(message);
      })
      .catch((rejectedValue: any) => {
        dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }
  const { name } = plant as Plant;

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-4"> Your request </h2>
        <h3 className="mb-4"> for {name} </h3>
        <form
          className="pl-0"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
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
          <p hidden={errorMessage ? false : true} className="warningColor">
            {" "}
            {errorMessage}{" "}
          </p>
          <div className="text-right">
            <button
              type="submit"
              disabled={isCreatingMessage ? true : false}
              className="btn btn-sm mx-2 form-control smallWidth"
            >
              Send
            </button>
            <button
              className="btn btn-sm mx-2 form-control smallWidth"
              onClick={() => {
                history.goBack();
              }}
            >
              Go back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestForm;
