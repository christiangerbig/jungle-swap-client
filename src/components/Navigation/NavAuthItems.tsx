import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NavAuthItems = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <Link to="/auth/sign-in" className="[ nav-auth-items__nav-link ] [ p-2 ]">
        {t("link.signIn")}
      </Link>
      <Link to="/auth/sign-up" className="[ nav-auth-items__nav-link ] [ p-2 ]">
        {t("link.signUp")}
      </Link>
    </>
  );
};

export default NavAuthItems;
