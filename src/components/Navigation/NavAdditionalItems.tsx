import { User } from "../../app/typeDefinitions";
import NavAuthentificationItems from "./NavAuthentificationItems";
import NavUserItems from "./NavUserItems";

type NavAdditionalItemsProps = {
  user: User | null;
};

const NavAdditionalItems = ({ user }: NavAdditionalItemsProps): JSX.Element => {
  if (user) {
    return <NavUserItems />;
  }
  return <NavAuthentificationItems />;
};

export default NavAdditionalItems;
