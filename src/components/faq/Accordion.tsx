import { AccordionItemData } from "../../app/typeDefinitions";
import AccordionItem from "./AccordionItem";

interface AccordionProps {
  data: AccordionItemData[];
}

const Accordion = ({ data }: AccordionProps): JSX.Element => {
  return (
    <div className="container my-5 w-100">
      {data.map(({ headerText, bodyText }) => (
        <AccordionItem header={headerText} body={bodyText} />
      ))}
    </div>
  );
};

export default Accordion;
