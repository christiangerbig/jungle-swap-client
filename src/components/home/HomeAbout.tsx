import { useTranslation } from "react-i18next";
import plantsImage from "../../images/JungleSwap_Home.png";
import plantPotIcon from "../../images/JungleSwap_Icon.png";

const HomeAbout = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="about centered container">
      <div className="row">
        <div className="col-sm-6 col-md-5 col-lg-6">
          <img
            src={plantsImage}
            loading="eager"
            alt="plants"
            className="is-background-image"
          />
        </div>
        <br />
        <div
          className={`
            about
            col-sm-6
            col-md-5
            col-lg-6
            px-5
            is-no-overflow
          `}
        >
          <article>
            <header>
              <h4>{t("texts.home.about.headline")}</h4>
              <h5>{t("texts.home.about.subheadline")}</h5>
            </header>
            <p>
              {t("texts.home.about.paragraph.line1")}
              <br />
              {t("texts.home.about.paragraph.line2")}
              <br />
              {t("texts.home.about.paragraph.line3")}
              <br />
              {t("texts.home.about.paragraph.line4")}
              <br />
              {t("texts.home.about.paragraph.line5")}
              <br />
              {t("texts.home.about.paragraph.line6")}
            </p>
            <img
              src={plantPotIcon}
              loading="lazy"
              alt="plant pot"
              className="is-icon"
            />
          </article>
        </div>
      </div>
    </div>
  );
};

export default HomeAbout;
