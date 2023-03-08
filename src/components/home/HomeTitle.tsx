import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { scrollToAbout } from "../../reducer/jungleSwapSlice";
import { useTranslation } from "react-i18next";

const HomeTitle = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <div className="[ home-title ] [ row pt-5 my-5 ]">
      <div className="col-6 offset-3 pt-5 my-5">
        <h2 className="home-title__headline mb-2">
          {t("texts.home.title.headline")}
        </h2>
        <h5 className="[ home-title__subheadline ] [ mt-3 mb-5 ]">
          {t("texts.home.title.subheadline")}
        </h5>
        <div className="mb-5">
          <Link
            to={"/"}
            className="home-title__link"
            onClick={(): void => {
              dispatch(scrollToAbout());
            }}
          >
            {t("link.tryIt")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeTitle;
