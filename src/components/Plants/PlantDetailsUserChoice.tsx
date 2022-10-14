import PlantDetailsBuyerChoice from "./PlantDetailsBuyerChoice";
import PlantDetailsCreatorChoice from "./PlantDetailsCreatorChoice";

type PlantDetailsUserChoiceProps = {
  isCreator: boolean;
};

const PlantDetailsUserChoice = ({
  isCreator,
}: PlantDetailsUserChoiceProps): JSX.Element => {
  if (isCreator) {
    return <PlantDetailsCreatorChoice />;
  }
  return <PlantDetailsBuyerChoice />;
};

export default PlantDetailsUserChoice;
