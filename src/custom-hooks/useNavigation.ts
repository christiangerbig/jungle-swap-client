import { useHistory } from "react-router";
import { animateScroll as scroll } from "react-scroll";

type Navigation = {
  goToHome: Function;
};

export const useNavigation = (): Navigation => {
  const history = useHistory();
  const navigation = {
    goToHome(): void {
      history.push("/");
      scroll.scrollToTop();
    },
  };
  return navigation;
};
