import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { linkedInPath1, linkedInPath2 } from "../lib/externalLinkPaths";

const Footer = (): JSX.Element => {
  const { t } = useTranslation();
  const currentTime = new Date();
  const year = currentTime.getFullYear();

  return (
    <div className="has-background-image">
      <footer>
        {t("footer.copyright")} {year}{" "}
        <Link
          to={{ pathname: linkedInPath1 }}
          target="_blank"
          rel="noreferrer noopener"
          className="is-link"
        >
          {t("footer.appAuthor1")}
        </Link>{" "}
        &amp;{" "}
        <Link
          to={{ pathname: linkedInPath2 }}
          target="_blank"
          rel="noreferrer noopener"
          className="is-link"
        >
          {t("footer.appAuthor2")}
        </Link>
      </footer>
    </div>
  );
};

export default Footer;
