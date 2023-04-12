import { useTranslation } from "react-i18next";
import { useFaqData } from "../../app/custom-hooks/useFaqData";
import Accordion from "../../components/faq/Accordion";

const FaqView = () => {
  const { t } = useTranslation();
  const faqData = useFaqData();

  return (
    <div className="container row my-5">
      <div className="col-12 col-md-6 offset-md-4 mt-5">
        <h2 className="text-left mb-5">{t("texts.faq.overview.headline")}</h2>
      </div>
      <div className="col-12 col-md-6 offset-md-4">
        <Accordion data={faqData} />
      </div>
    </div>
  );
};

export default FaqView;
