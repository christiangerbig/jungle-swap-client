import { User } from "../../app/typeDefinitions";
import NavAuthItems from "./NavAuthItems";
import NavUserItems from "./NavUserItems";

interface NavAdditionalItemsProps {
  user: User | null;
}

const NavAdditionalItems = ({ user }: NavAdditionalItemsProps): JSX.Element => {
  if (user) {
    return <NavUserItems />;
  }
  return <NavAuthItems />;
};

export default NavAdditionalItems;
