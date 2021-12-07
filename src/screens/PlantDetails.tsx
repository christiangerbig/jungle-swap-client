import { useEffect } from "react";
import { Link, Redirect, useParams, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setIsFetchingPlant,
  fetchPlant,
  setPlant,
  setIsDeletingPlant,
  deletePlant,
  removePlant,
  setIsDeletingMessage,
  deleteMessage,
  removeMessage,
  scrollToPlants,
} from "../reducer/jungleSwapSlice";
import { User, Plant, PlantId, Message } from "../typeDefinitions";
import { RootState } from "../store";
import { handleDeletePlantImage, protectRoute } from "../lib/utilities";

const PlantDetails = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const isFetchingPlant = useAppSelector(
    (state: RootState) => state.jungleSwap.isFetchingPlant
  );
  const isDeletingPlant = useAppSelector(
    (state: RootState) => state.jungleSwap.isDeletingPlant
  );
  const isDeletingPlantImage = useAppSelector(
    (state: RootState) => state.jungleSwap.isDeletingPlantImage
  );
  const messages = useAppSelector(
    (state: RootState) => state.jungleSwap.messages
  );
  const isDeletingMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.isDeletingMessage
  );
  const { plantId } = useParams<{ plantId: PlantId }>();
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    const fetchPlantData = (plantId: PlantId): void => {
      const setPlantAndScrollToTop = (plant: Plant): void => {
        dispatch(setPlant(plant));
        scroll.scrollToTop();
      };

      dispatch(setIsFetchingPlant(true));
      dispatch(fetchPlant(plantId))
        .unwrap()
        .then((plant: Plant) => {
          setPlantAndScrollToTop(plant);
        })
        .catch((rejectedValue: any) => {
          console.log(rejectedValue.message);
        });
    };

    protectRoute(dispatch);
    loggedInUser && fetchPlantData(plantId);
  }, []);

  const handleDeleteRemainingMessages = (
    messages: Message[],
    plantId: PlantId
  ): void => {
    messages.forEach((message: Message): void => {
      const { _id, plant } = message;
      if ((plant as Plant)._id === plantId) {
        dispatch(setIsDeletingMessage(true));
        dispatch(deleteMessage(_id as PlantId))
          .unwrap()
          .then(() => {
            dispatch(removeMessage(_id as PlantId));
          })
          .catch((rejectedValue: any) => {
            console.log(rejectedValue.message);
          });
      }
    });
  };

  const handleDeletePlant = (plantId: PlantId): void => {
    const removePlantAndReturnToPlantsSection = (plantId: PlantId): void => {
      dispatch(removePlant(plantId));
      history.push("/");
      dispatch(scrollToPlants());
    };

    dispatch(setIsDeletingPlant(true));
    dispatch(deletePlant(plantId))
      .unwrap()
      .then(() => {
        removePlantAndReturnToPlantsSection(plantId);
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  };

  if (!loggedInUser) {
    return <Redirect to={"/auth/sign-up"} />;
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
      {isFetchingPlant || !creator ? (
        <LoadingSpinner />
      ) : (
        <div className="col">
          <div className="card cardMediumWidth">
            <img
              src={imageUrl}
              alt={name}
              hidden={imageUrl ? false : true}
              className="card-img-top mediumPicSize"
            />
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
                        disabled={
                          isDeletingMessage ||
                          isDeletingPlantImage ||
                          isDeletingPlant
                            ? true
                            : false
                        }
                        className="btn btn-sm ml-2 form-control smallWidth mb-2"
                        onClick={() => {
                          handleDeleteRemainingMessages(
                            messages,
                            _id as PlantId
                          );
                          handleDeletePlantImage({ imagePublicId }, dispatch);
                          handleDeletePlant(_id as PlantId);
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
      )}
    </div>
  );
};

export default PlantDetails;
