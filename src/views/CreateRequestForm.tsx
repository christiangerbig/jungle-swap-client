import { useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setErrorMessage } from "../reducer/jungleSwapSlice";
import { User, Plant, Message } from "../typeDefinitions";
import { RootState } from "../store";
import { Routing } from "../lib/routing";
import { MessageIO } from "../lib/messageIO";
import ErrorMessageOutput from "../components/ErrorMessageOutput";

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
  const { name } = plant as Plant;

  useEffect(() => {
    const routing = new Routing(dispatch);
    routing.protect((): void => {
      dispatch(setErrorMessage(null));
      scroll.scrollToTop();
    });
  }, []);

  const handleCreateMessageForRequest = (
    event: React.FormEvent<HTMLFormElement>,
    { _id, creator }: Plant
  ): void => {
    const { request } = event.target as any;
    const newMessage: Message = {
      seller: (creator as User)._id,
      plant: _id,
      request: request.value,
    };
    event.preventDefault();
    const messageIO = new MessageIO(dispatch);
    messageIO.create(newMessage, (): void => {
      history.goBack();
    });
  };

  const printErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case "Form: Request text missing":
        return t("errorTexts.messages.createRequest.form.requestTextMissing");
      default:
        return t("errorTexts.general");
    }
  };

  const buttonState = (): boolean => {
    return isCreatingMessage ? true : false;
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-4">
          {t("texts.requests.createRequest.form.headline")}
        </h2>
        <h3 className="mb-4">
          {t("texts.requests.createRequest.form.subheadline")} {name}
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
            <ErrorMessageOutput printErrorMessage={printErrorMessage} />
          )}
          <div className="text-right">
            <button
              type="submit"
              disabled={buttonState()}
              className="btn btn-sm mx-2 form-control is-width-medium"
            >
              {t("button.send")}
            </button>
            <button
              className="btn btn-sm mx-2 form-control is-width-medium"
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
