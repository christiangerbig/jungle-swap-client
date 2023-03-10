import { useTranslation } from "react-i18next";
import plantsImage from "../../images/JungleSwap_Home.png";
import plantPotIcon from "../../images/JungleSwap_Icon.png";

const HomeAbout = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="[ home-about ] [ container pt-5 ]">
      <div className="row">
        <div className="[ home-about__image ] [ col-sm-6 col-md-6 col-lg-6 ]">
          <img
            src={plantsImage}
            loading="eager"
            alt="plants"
            className="w-100 h-100"
          />
        </div>
        <br />
        <div className="col-sm-6 col-md-6 col-lg-6 px-5">
          <article className="mt-4">
            <header>
              <h4 className="home-about__headline">
                {t("texts.home.about.headline")}
              </h4>
              <h5 className="home-about__subheadline">
                {t("texts.home.about.subheadline")}
              </h5>
            </header>
            <p className="home-about__paragraph">
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
            <div className="home-about__icon">
              <img
                src={plantPotIcon}
                loading="lazy"
                alt="plant pot"
                className="w-100 h-100"
              />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default HomeAbout;
