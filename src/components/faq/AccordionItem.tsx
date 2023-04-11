import { useEffect, useMemo, useRef, useState } from "react";

interface AccordionItemProps {
  header: String;
  body: String;
}

const AccordionItem = ({ header, body }: AccordionItemProps): JSX.Element => {
  const [isBodyVisible, setIsBodyVisible] = useState<boolean>(false);
  const divBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accordionItemBody = divBodyRef.current;

    if (isBodyVisible) {
      accordionItemBody &&
        (accordionItemBody.style.height = `${accordionItemBody.scrollHeight}px`);
    } else {
      accordionItemBody && (accordionItemBody.style.height = "0");
    }
  }, [isBodyVisible]);

  const handleClickButton = () => {
    setIsBodyVisible(!isBodyVisible);
  };

  const setHeaderActive = useMemo(
    (): string => (isBodyVisible ? "accordion-item__header--is-active" : ""),
    [isBodyVisible]
  );

  const setImageActive = useMemo(
    (): string =>
      isBodyVisible ? "accordion-item__header__imagebox__image--is-active" : "",
    [isBodyVisible]
  );

  return (
    <div className="accordion-item">
      <div className={`accordion-item__header ${setHeaderActive}`}>
        <button
          type="button"
          className="accordion-item__header__button"
          onClick={handleClickButton}
        >
          <h4 className="accordion-item__header__text">{header}</h4>
          <div className="accordion-item__header__imagebox mx-2 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 412"
              className={`accordion-item__header__imagebox__image ${setImageActive}   w-100 h-100 `}
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </svg>
          </div>
        </button>
      </div>
      <div ref={divBodyRef} className="accordion-item__body">
        <p>
          {body}
          <br />
        </p>
      </div>
      <hr className="accordion-item__horizontal-ruler" />
    </div>
  );
};

export default AccordionItem;
