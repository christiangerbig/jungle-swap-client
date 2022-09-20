import { useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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

  const printErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Request text missing":
        return t("errors.message.form.requestTextMissing");
      default:
        return t("errors.general");
    }
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }
  const { name } = plant as Plant;

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-4">{t("createRequestForm.headline")}</h2>
        <h3 className="mb-4">
          {t("createRequestForm.subheadline")} {name}
        </h3>
        <form
          className="pl-0 form-style"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            handleCreateMessageForRequest(event, plant);
          }}
        >
          <div>
            <textarea
              name="request"
              cols={35}
              rows={7}
              className="mb-4 form-control is-width-full"
            />
          </div>
          {errorMessage && errorMessage.includes("Form") && (
            <span className="is-danger is-text-bold is-display-block">
              {printErrorMessage(errorMessage)}
            </span>
          )}
          <div className="text-right">
            <button
              type="submit"
              disabled={isCreatingMessage ? true : false}
              className="btn btn-sm mx-2 form-control is-width-s"
            >
              {t("button.send")}
            </button>
            <button
              className="btn btn-sm mx-2 form-control is-width-s"
              onClick={() => {
                history.goBack();
              }}
            >
              {t("button.goBack")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestForm;
