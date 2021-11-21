import { useEffect } from "react";
import { Link, Redirect, useParams, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  readPlant,
  deletePlant,
  deleteMessage,
  scrollToPlants,
  User,
  Message,
  Plant,
  setPlant,
  deletePlantImage,
  removePlant,
  PlantId,
  ImagePublicId,
  DestroyImageData,
  removeMessage,
  decreaseAmountOfReplies,
  checkUserLoggedIn,
  setLoggedInUser,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const PlantDetails = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isFetchingPlant = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingPlant
  );
  const messages = useAppSelector(
    (state: RootState) => state.jungleSwap.messages
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const { plantId } = useParams<{ plantId: PlantId }>();
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Read plant data and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        dispatch(readPlant(plantId))
          .unwrap()
          .then((plant: Plant) => {
            dispatch(setPlant(plant));
            scroll.scrollToTop();
          })
          .catch((rejectedValue: any) => {
            console.log(rejectedValue.message);
          });
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  }, []);

  // Delete plant
  const handleDeletePlant = (
    imagePublicId: ImagePublicId,
    plantId: PlantId,
    messages: Message[]
  ) => {
    messages.forEach((message: Message) => {
      const { _id, plant }: any = message;
      if (plant._id === plantId) {
        dispatch(deleteMessage(_id))
          .unwrap()
          .then(() => {
            dispatch(removeMessage(_id));
            dispatch(decreaseAmountOfReplies());
          })
          .catch((rejectedValue: any) => {
            console.log(rejectedValue.message);
          });
      }
    });
    const destroyImageData: DestroyImageData = {
      imagePublicId,
    };
    dispatch(deletePlantImage(destroyImageData))
      .unwrap()
      .then(() => {
        dispatch(deletePlant(plantId))
          .unwrap()
          .then(() => {
            dispatch(removePlant(plantId));
            history.push("/");
            dispatch(scrollToPlants());
          })
          .catch((rejectedValue: any) => {
            console.log(rejectedValue.message);
          });
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/signup"} />;
  }

  if (isFetchingPlant) {
    return (
      <div className="container mt-5">
        <LoadingSpinner spinnerText={"Loading plant details..."} />
      </div>
    );
  }

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
                      onClick={() => {
                        handleDeletePlant(imagePublicId, _id, messages);
                      }}
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
                    <Link to="/messages/create">
                      <button className="btn btn-sm ml-2 form-control smallWidth mb-2">
                        Swap
                      </button>
                    </Link>
                  </div>
                )}
                <Link
                  to={"/"}
                  onClick={() => {
                    dispatch(scrollToPlants());
                  }}
                >
                  <button className="btn btn-sm ml-2 form-control smallWidth mb-3">
                    Go back
                  </button>
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
