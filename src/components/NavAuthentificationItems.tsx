import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NavAuthentificationItems = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <Link to="/auth/sign-in" className="p-2">
        {t("link.signIn")}
      </Link>
      <Link to="/auth/sign-up" className="p-2">
        {t("link.signUp")}
      </Link>
    </>
  );
};

export default NavAuthentificationItems;
