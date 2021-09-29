import { useEffect } from "react";
import { Link, Redirect, useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import {
  readPlant,
  deletePlant,
  deleteRequest,
  scrollToPlants,
  User,
  Request,
  Plant,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const PlantDetails = () => {
  const loggedInUser = useSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const requests = useSelector((state: RootState) => state.jungleSwap.requests);
  const plant = useSelector((state: RootState) => state.jungleSwap.plant);
  const { plantId }: any = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  // Read plant data and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(readPlant(plantId));
    scroll.scrollToTop();
  }, []);

  // Delete plant
  const handleDeletePlant = (
    imagePublicId: string | undefined,
    plantId: string | undefined,
    history: any,
    requests: Request[]
  ) => {
    requests.forEach((request: Request) => {
      const { plant }: any = request;
      if (plant._id === plantId) {
        dispatch(deleteRequest({ requestId: request._id, history: null }));
      }
    });
    dispatch(deletePlant({ imagePublicId, plantId, history }));
  };

  if (!loggedInUser) return <Redirect to={"/signup"} />;

  const {
    _id,
    name,
    description,
    size,
    imageUrl,
    imagePublicId,
    location,
    price,
    creator,
  } = plant as Plant;
  if (!creator)
    return (
      <div className="spinner-grow text-success m-5" role="status">
        <span className="visually-hidden">
          <br /> <br /> Loading plant details...
        </span>
      </div>
    );

  return (
    <div className="container mt-5 row row-md-10 offset-md-4">
      <div className="mt-4 mb-3 pt-4 container">
        <h2> Plant details </h2>
      </div>
      <div className="col">
        <div className="card cardMediumWidth">
          {imageUrl && (
            <img
              className="card-img-top mediumPicSize"
              src={imageUrl}
              alt={name}
            />
          )}
          <div className="ml-2 mt-2">
            <span> Name: </span> {name}
          </div>
          <div className="ml-2 mt-2">
            <span> Description: </span> {description}
          </div>
          <div className="ml-2 mt-2">
            <span> Size: </span> {size} cm
          </div>
          <div className="ml-2 mt-2">
            <span> Likes: </span> {location}
          </div>
          <div className="ml-2 mt-2">
            <span> Price: </span> {price} €
          </div>
          <div className="ml-2 mt-2 col justify-content-center">
            <div className="row-2 justify-content-center">
              <div className="card-body text-right pt-0">
                {loggedInUser._id === (creator as User)._id ? (
                  <div className="p-0">
                    <Link to={"/plants/update"}>
                      <button className="btn btn-sm ml-2 form-control smallWidth mb-2">
                        Update
                      </button>
                    </Link>
                    <button
                      className="btn btn-sm ml-2 form-control smallWidth mb-2"
                      onClick={() =>
                        handleDeletePlant(imagePublicId, _id, history, requests)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div>
                    <Link to="/plants/checkout">
                      <button className="btn btn-sm ml-2 form-control smallWidth mb-2">
                        Buy
                      </button>
                    </Link>
                    <Link to="/requests/create">
                      <button className="btn btn-sm ml-2 form-control smallWidth mb-2">
                        Swap
                      </button>
                    </Link>
                  </div>
                )}
                <Link to={"/"} onClick={() => dispatch(scrollToPlants())}>
                  <button className="btn btn-sm ml-2 form-control smallWidth mb-3"> Go back </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
