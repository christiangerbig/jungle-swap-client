import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { linkedInPath1, linkedInPath2 } from "../lib/externalLinkPaths";

const Footer = (): JSX.Element => {
  const { t } = useTranslation();
  const currentTime = new Date();
  const year = currentTime.getFullYear();

  return (
    <footer className="footer">
      <div className="[ footer__navigation ] [ text-center ]">
        {t("texts.footer.copyright")} {year}{" "}
        <Link
          to={{ pathname: linkedInPath1 }}
          target="_blank"
          rel="noreferrer noopener"
          className="footer__navigation__nav-link"
        >
          {t("texts.footer.appAuthor1")}
        </Link>{" "}
        &amp;{" "}
        <Link
          to={{ pathname: linkedInPath2 }}
          target="_blank"
          rel="noreferrer noopener"
          className="footer__navigation__nav-link"
        >
          {t("texts.footer.appAuthor2")}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
