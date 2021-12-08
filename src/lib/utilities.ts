import { animateScroll as scroll } from "react-scroll";
import {
  checkUserLoggedIn,
  deletePlantImage,
  fetchAllMessages,
  fetchAllPlants,
  fetchMessage,
  setDelayCounter,
  setIntervalId,
  setIsDeletingPlantImage,
  setIsFetchingMessage,
  setIsFetchingMessages,
  setIsFetchingPlants,
  setLoggedInUser,
  setMessage,
  setMessages,
  setPlants,
} from "../reducer/jungleSwapSlice";
import {
  DestroyImageData,
  Message,
  MessageId,
  Plant,
  User,
} from "../typeDefinitions";

export const protectRoute = (dispatch: any): void => {
  dispatch(checkUserLoggedIn())
    .unwrap()
    .then((user: User) => {
      dispatch(setLoggedInUser(user));
    })
    .catch((rejectedValue: any) => {
      console.log(rejectedValue.message);
    });
};

export const fetchPlants = (dispatch: any): void => {
  dispatch(setIsFetchingPlants(true));
  dispatch(fetchAllPlants())
    .unwrap()
    .then((plants: Plant[]) => {
      dispatch(setPlants(plants));
    })
    .catch((rejectedValue: any) => {
      console.log(rejectedValue.message);
    });
};

export const stopIntervalCounter = (
  intervalId: NodeJS.Timeout,
  dispatch: any
): void => {
  clearInterval(intervalId);
  dispatch(setIntervalId(null));
  dispatch(setDelayCounter(0));
};

export const fetchSingleMessage = (
  messageId: MessageId,
  dispatch: any
): void => {
  dispatch(setIsFetchingMessage(true));
  dispatch(fetchMessage(messageId))
    .unwrap()
    .then((message: Message) => {
      dispatch(setMessage(message));
    })
    .catch((rejectedValue: any) => {
      console.log(rejectedValue.message);
    });
};

export const fetchMessages = (dispatch: any): void => {
  dispatch(setIsFetchingMessages(true));
  dispatch(fetchAllMessages())
    .unwrap()
    .then((messages: Message[]) => {
      dispatch(setMessages(messages));
    })
    .catch((rejectedValue: any) => {
      console.log(rejectedValue.message);
    });
};

export const handleDeletePlantImage = (
  destroyImageData: DestroyImageData,
  dispatch: any
): void => {
  dispatch(setIsDeletingPlantImage(true));
  dispatch(deletePlantImage(destroyImageData))
    .unwrap()
    .then(() => {
      return;
    })
    .catch((rejectedValue: any) => {
      console.log(rejectedValue.message);
    });
};
