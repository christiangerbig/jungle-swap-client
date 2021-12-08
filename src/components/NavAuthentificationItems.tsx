import { Link } from "react-router-dom";

const NavAuthentificationItems = (): JSX.Element => {
  return (
    <>
      <Link to="/auth/sign-in" className="p-2">
        Sign in
      </Link>
      <Link to="/auth/sign-up" className="p-2">
        Sign up
      </Link>
    </>
  );
};

export default NavAuthentificationItems;
