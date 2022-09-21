import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { scrollToAbout } from "../reducer/jungleSwapSlice";
import { useTranslation } from "react-i18next";

const Title = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <div className="row my-5">
      <div className="col-6 offset-3 my-5 has-border-around">
        <h2 className="title mb-2">{t("title.headline")}</h2>
        <h5 className="mt-3 mb-5">{t("title.subheadline")}</h5>
        <div className="mb-5">
          <Link
            to={"/"}
            className="is-font-size-large is-link"
            onClick={() => {
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

export default Title;
