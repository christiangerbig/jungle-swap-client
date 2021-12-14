import {
  fetchAllPlants,
  setIsFetchingPlants,
  setPlants,
} from "../reducer/jungleSwapSlice";
import { Plant } from "../typeDefinitions";

export class PlantIO {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }
  fetchAll = (): void => {
    this.dispatch(setIsFetchingPlants(true));
    this.dispatch(fetchAllPlants())
      .unwrap()
      .then((plants: Plant[]) => {
        this.dispatch(setPlants(plants));
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };
}
