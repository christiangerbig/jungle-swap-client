import { useTranslation } from "react-i18next";
import { AccordionItemData } from "../typeDefinitions";

export const useFaqData = (): AccordionItemData[] => {
  const { t } = useTranslation();

  return [
    {
      headerText: t("texts.faq.item1.header"),
      bodyText: t("texts.faq.item1.body"),
    },
    {
      headerText: t("texts.faq.item2.header"),
      bodyText: t("texts.faq.item2.body"),
    },
    {
      headerText: t("texts.faq.item3.header"),
      bodyText: t("texts.faq.item3.body"),
    },
    {
      headerText: t("texts.faq.item4.header"),
      bodyText: t("texts.faq.item4.body"),
    },
  ];
};
