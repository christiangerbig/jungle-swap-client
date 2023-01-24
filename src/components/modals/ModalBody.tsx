import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../app/hooks";
import { setErrorMessage } from "../../reducer/jungleSwapSlice";

interface ModalBodyProps {
  headline: string;
  subheadline: string;
  text: string;
  isClose: boolean;
}

const ModalBody = ({
  headline,
  subheadline,
  text,
  isClose,
}: ModalBodyProps): JSX.Element => {
  const divElementRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleCloseModal = (): void => {
    dispatch(setErrorMessage(null));
  };

  const handleClickOutside = ({ target }: any): void => {
    if (divElementRef.current === target && isClose) {
      handleCloseModal();
    }
  };

  return (
    <div
      ref={divElementRef}
      className="error-modal fade-error-modal-in"
      onClick={handleClickOutside}
    >
      <div className="error-modal-box">
        <h1>{headline}</h1>
        <h2>{subheadline}</h2>
        <h3>{text}</h3>
        {isClose && (
          <button
            className="btn form-control is-width-small mt-4 mb-3"
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
