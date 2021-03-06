import { Link } from "react-router-dom";
import { Plant } from "../typeDefinitions";

type PlantThumbnailProps = {
  plant: Plant;
};

const PlantThumbnail = ({ plant }: PlantThumbnailProps): JSX.Element => {
  const { _id, name, imageUrl, price } = plant;

  return (
    <div className="col mb-5">
      <div className="card card-medium-width text-center h-100">
        <img src={imageUrl} alt={name} className="card-img-top mediumPicSize" />
        <div className="card-body mb-5">
          <h5> {name} </h5>
          <p> {price} € </p>
          <Link
            className="btn form-control smallWidth"
            to={`/plants/fetch/${_id}`}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlantThumbnail;
