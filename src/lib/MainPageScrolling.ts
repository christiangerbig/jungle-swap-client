import { animateScroll as scroll } from "react-scroll";

export class MainPageScrolling {
  history: any;
  constructor(history: any) {
    this.history = history;
  }

  toTop = (): void => {
    this.history.push("/");
    scroll.scrollToTop();
  };
}
