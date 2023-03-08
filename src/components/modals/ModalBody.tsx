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
      className="modal-body"
      onClick={handleClickOutside}
    >
      <div className="modal-body__box">
        <h1 className="modal-body__box__headline">{headline}</h1>
        <h2 className="modal-body__box__subheadline">{subheadline}</h2>
        <h3 className="modal-body__box__text">{text}</h3>
        {isClose && (
          <button
            className="[ button--width-small ] [ btn form-control mt-4 mb-3 ]"
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
