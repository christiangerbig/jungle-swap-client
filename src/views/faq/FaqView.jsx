import { useTranslation } from "react-i18next";
import { useFaqData } from "../../app/custom-hooks/useFaqData";
import Accordion from "../../components/faq/Accordion";

const FaqView = () => {
  const { t } = useTranslation();
  const faqData = useFaqData();

  return (
    <div className="container row mt-5 mx-auto">
      <div className="col-11 col-md-5 offset-1 offset-md-5 mt-5">
        <h2>{t("texts.faq.overview.headline")}</h2>
      </div>
      <div>
        <Accordion data={faqData} />
      </div>
    </div>
  );
};

export default FaqView;
