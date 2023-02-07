import { useHistory } from "react-router";
import { animateScroll as scroll } from "react-scroll";

interface NavigationMethods {
  goToHome: Function;
}

export const useNavigation = (): NavigationMethods => {
  const { push } = useHistory();
  const { scrollToTop } = scroll;

  return {
    goToHome: (): void => {
      push("/");
      scrollToTop();
    },
  };
};
