interface PlantItemProps {
  keyword: string;
  description: string | undefined;
}

const PlantItem = ({ keyword, description }: PlantItemProps): JSX.Element => {
  return (
    <div className="ml-2 mt-2">
      <span className="font-weight-bold">{keyword}</span> {description}
    </div>
  );
};

export default PlantItem;
