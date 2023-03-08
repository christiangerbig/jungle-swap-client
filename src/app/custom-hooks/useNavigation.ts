import { useHistory } from "react-router";
import { animateScroll as scroll } from "react-scroll";

interface NavigationMethods {
  goToHome: Function;
  goToRequests: Function;
  goToReplies: Function;
}

export const useNavigation = (): NavigationMethods => {
  const { push } = useHistory();
  const { scrollToTop } = scroll;

  return {
    goToHome: (): void => {
      push("/");
      scrollToTop();
    },

    goToRequests: (): void => {
      push("/requests/fetch-all");
      scrollToTop();
    },

    goToReplies: (): void => {
      push("/replies/fetch-all");
      scrollToTop();
    },
  };
};
