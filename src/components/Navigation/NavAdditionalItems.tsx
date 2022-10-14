import { User } from "../../typeDefinitions";
import NavAuthentificationItems from "./NavAuthentificationItems";
import NavLoggedInUserItems from "./NavLoggedInUserItems";

type NavAdditionalItemsProps = {
  user: User | null;
};

const NavAdditionalItems = ({ user }: NavAdditionalItemsProps): JSX.Element => {
  if (user) {
    return <NavLoggedInUserItems />;
  }
  return <NavAuthentificationItems />;
};

export default NavAdditionalItems;
