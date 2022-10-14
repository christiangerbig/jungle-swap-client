import PlantDetailsBuyerItems from "../../components/plants/PlantDetailsBuyerItems";
import PlantDetailsCreatorItems from "../../components/plants/PlantDetailsCreatorItems";

type PlantDetailsUserItemsProps = {
  isCreator: boolean;
};

const PlantDetailsUserItems = ({
  isCreator,
}: PlantDetailsUserItemsProps): JSX.Element => {
  if (isCreator) {
    return <PlantDetailsCreatorItems />;
  }
  return <PlantDetailsBuyerItems />;
};

export default PlantDetailsUserItems;
