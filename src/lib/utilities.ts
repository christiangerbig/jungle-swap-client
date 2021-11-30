import { animateScroll as scroll } from "react-scroll";
import {
  checkUserLoggedIn,
  deletePlantImage,
  fetchAllMessages,
  fetchMessage,
  setDelayCounter,
  setIntervalId,
  setIsDeletingPlantImage,
  setIsFetchingMessage,
  setIsFetchingMessages,
  setLoggedInUser,
  setMessage,
  setMessages,
} from "../reducer/jungleSwapSlice";
import { DestroyImageData, Message, MessageId, User } from "../typeDefinitions";

// Check if a user is logged in
export const protectPage = (dispatch: any): void => {
  dispatch(checkUserLoggedIn())
    .unwrap()
    .then((user: User) => {
      dispatch(setLoggedInUser(user));
    })
    .catch((rejectedValue: any) => {
      console.log(rejectedValue.message);
    });
};

// Stop interval counter and reset its variables
export const stopIntervalCounter = (
  intervalId: NodeJS.Timeout,
  dispatch: any
): void => {
  clearInterval(intervalId);
  dispatch(setIntervalId(null));
  dispatch(setDelayCounter(0));
};

// Fetch single message and scroll page to top
export const fetchSingleMessage = (
  messageId: MessageId,
  dispatch: any
): void => {
  dispatch(setIsFetchingMessage(true));
  dispatch(fetchMessage(messageId))
    .unwrap()
    .then((message: Message) => {
      dispatch(setMessage(message));
      scroll.scrollToTop();
    })
    .catch((rejectedValue: any) => {
      console.log(rejectedValue.message);
    });
};

// Fetch all messages
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

// Delete old plant image
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
