import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks";
import { setErrorMessage } from "../../reducer/jungleSwapSlice";

type ModalBodyProps = {
  headline: string;
  subheadline: string;
  errorText: string;
  isClose: boolean;
};

const ModalBody = ({
  headline,
  subheadline,
  errorText,
  isClose,
}: ModalBodyProps): JSX.Element => {
  const divElementRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleCloseModal = (): void => {
    dispatch(setErrorMessage(null));
  };

  const handleClickOutside = (event: any): void => {
    if (divElementRef.current === event.target) {
      handleCloseModal();
    }
  };

  return (
    <div
      ref={divElementRef}
      className="error-modal fade-error-modal-in"
      onClick={(event: any): void => {
        isClose && handleClickOutside(event);
      }}
    >
      <div className="error-modal-box">
        <h1>{headline}</h1>
        <h2>{subheadline}</h2>
        <h3>{errorText}</h3>
        {isClose && (
          <button
            className="error-modal-button mt-4 mb-3"
            onClick={handleCloseModal}
          >
            {t("button.proceed")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalBody;
