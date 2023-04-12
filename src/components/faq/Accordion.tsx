import { AccordionItemData } from "../../app/typeDefinitions";
import AccordionItem from "./AccordionItem";

interface AccordionProps {
  data: AccordionItemData[];
}

const Accordion = ({ data }: AccordionProps): JSX.Element => {
  return (
    <div className="mb-5">
      {data.map(({ headerText, bodyText }) => (
        <AccordionItem header={headerText} body={bodyText} />
      ))}
    </div>
  );
};

export default Accordion;
