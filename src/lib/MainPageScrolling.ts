import { animateScroll as scroll } from "react-scroll";

export class MainPageScrolling {
  history: any;
  constructor(history: any) {
    this.history = history;
  }

  toTop = () => {
    this.history.push("/");
    scroll.scrollToTop();
  };
}
