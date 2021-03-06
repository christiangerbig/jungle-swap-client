import { checkUserLoggedIn, setLoggedInUser } from "../reducer/jungleSwapSlice";
import { User } from "../typeDefinitions";

export class Routing {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }
  protect = (): void => {
    this.dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user: User) => {
        this.dispatch(setLoggedInUser(user));
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };
}
