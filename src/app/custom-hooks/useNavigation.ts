import { useHistory } from "react-router";
import { animateScroll as scroll } from "react-scroll";

type Navigation = {
  goToHome: Function;
};

export const useNavigation = (): Navigation => {
  const { push } = useHistory();
  const { scrollToTop } = scroll;

  const navigation = {
    goToHome: (): void => {
      push("/");
      scrollToTop();
    },
  };
  return navigation;
};
