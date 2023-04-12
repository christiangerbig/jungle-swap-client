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

  const headerActive = useMemo(
    (): string => (isBodyVisible ? "accordion-item__header--is-active" : ""),
    [isBodyVisible]
  );

  const imageActive = useMemo(
    (): string =>
      isBodyVisible ? "accordion-item__header__imagebox__image--is-active" : "",
    [isBodyVisible]
  );

  const handleClickButton = () => {
    setIsBodyVisible(!isBodyVisible);
  };

  return (
    <div className="accordion-item">
      <div className={`accordion-item__header ${headerActive}`}>
        <button
          type="button"
          className={`
            [ 
              accordion-item__header__button 
            ] 
            [ 
              d-flex 
              flex-row 
              justify-content-between 
              align-items-start 
              w-100 
              text-left 
              p-2 
              border-0 
            ]
          `}
          onClick={handleClickButton}
        >
          <h4 className="[ accordion-item__header__text ] [ mx-0 mt-1 mb-1 ]">
            {header}
          </h4>
          <div className="[ accordion-item__header__imagebox ] [ mx-2 mt-1 ]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 412"
              className={`[ accordion-item__header__imagebox__image ${imageActive} ] [ w-full h-100 ]`}
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </svg>
          </div>
        </button>
      </div>
      <div
        ref={divBodyRef}
        className="[ accordion-item__body ] [ pt-0 pt-1 px-1 overflow-hidden ]"
      >
        <p className="px-0 py-1">
          {body}
          <br />
        </p>
      </div>
      <hr className="mx-1 my-0" />
    </div>
  );
};

export default AccordionItem;
