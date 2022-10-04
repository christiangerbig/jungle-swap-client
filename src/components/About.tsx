import { useTranslation } from "react-i18next";
import plantsImage from "../images/JungleSwap_Home.png";
import plantPotIcon from "../images/JungleSwap_Icon.png";

const About = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="about centered container">
      <div className="row">
        <div className="col-sm-6 col-md-5 col-lg-6">
          <img src={plantsImage} alt="plants" className="is-background-image" />
        </div>
        <br />
        <div className="about col-sm-6 col-md-5 col-lg-6 px-5 is-no-overflow">
          <article>
            <header>
              <h4>{t("about.headline")}</h4>
              <h5>{t("about.subheadline")}</h5>
            </header>
            <p>
              {t("about.paragraph.line1")}<br />
              {t("about.paragraph.line2")}<br />
              {t("about.paragraph.line3")}<br />
              {t("about.paragraph.line4")}<br />
              {t("about.paragraph.line5")}<br />
              {t("about.paragraph.line6")}
            </p>
            <img src={plantPotIcon} alt="plant pot" className="is-icon" />
          </article>
        </div>
      </div>
    </div>
  );
};

export default About;
