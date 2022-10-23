import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { scrollToAbout } from "../../reducer/jungleSwapSlice";
import { useTranslation } from "react-i18next";

const HomeTitle = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <div className="row my-5">
      <div className="col-6 offset-3 my-5 has-border-around">
        <h2 className="title mb-2">{t("texts.home.title.headline")}</h2>
        <h5 className="mt-3 mb-5">{t("texts.home.title.subheadline")}</h5>
        <div className="mb-5">
          <Link
            to={"/"}
            className="try-it-link is-link"
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
