import { useAppDispatch } from "../hooks";
import {
  addMessage,
  createMessage,
  deleteMessage,
  fetchAllMessages,
  fetchMessage,
  removeMessage,
  setAmountOfReplies,
  setAmountOfRequests,
  setErrorMessage,
  setIsCreatingMessage,
  setIsDeletingMessage,
  setIsFetchingMessage,
  setIsFetchingMessages,
  setIsNewReply,
  setIsNewRequest,
  setIsUpdatingMessage,
  setMessage,
  setMessageChanges,
  setMessages,
  updateMessage,
} from "../reducer/jungleSwapSlice";
import { Message, MessageId, Plant, PlantId, User } from "../typeDefinitions";

type HandleMessage = {
  createMessage: Function;
  fetchMessage: Function;
  fetchMessages: Function;
  fetchCheck: Function;
  updateMessage: Function;
  deleteMessage: Function;
  deleteRemainingMessages: Function;
  checkNewRequests: Function;
  checkNewReplies: Function;
};

export const useHandleMessage = (): HandleMessage => {
  const dispatch = useAppDispatch();
  const handleMessage = {
    createMessage(newMessage: Message, callbackFunction: Function): void {
      dispatch(setIsCreatingMessage(true));
      dispatch(createMessage(newMessage))
        .unwrap()
        .then((message: Message): void => {
          dispatch(addMessage(message));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    fetchMessage(messageId: MessageId, callbackFunction: Function): void {
      dispatch(setIsFetchingMessage(true));
      dispatch(fetchMessage(messageId))
        .unwrap()
        .then((message: Message): void => {
          dispatch(setMessage(message));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    fetchMessages(callbackFunction: Function): void {
      dispatch(setIsFetchingMessages(true));
      dispatch(fetchAllMessages())
        .unwrap()
        .then((messages: Message[]): void => {
          dispatch(setMessages(messages));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    fetchCheck(callbackFunction: Function): void {
      dispatch(fetchAllMessages())
        .unwrap()
        .then((messages: Message[]): void => {
          dispatch(setMessages(messages));
          callbackFunction(messages);
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    updateMessage(
      messageId: MessageId,
      updatedMessage: Message,
      callbackFunction: Function
    ): void {
      dispatch(setIsUpdatingMessage(true));
      dispatch(updateMessage({ messageId, updatedMessage }))
        .unwrap()
        .then((message: Message): void => {
          dispatch(setMessageChanges(message));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    deleteMessage(messageId: MessageId, callbackFunction: Function): void {
      dispatch(setIsDeletingMessage(true));
      dispatch(deleteMessage(messageId))
        .unwrap()
        .then((): void => {
          dispatch(removeMessage(messageId));
          callbackFunction();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    deleteRemainingMessages(messages: Message[], plantId: PlantId): void {
      messages.forEach(({ _id, plant }: Message): void => {
        if ((plant as Plant)._id === plantId) {
          dispatch(setIsDeletingMessage(true));
          dispatch(deleteMessage(_id as PlantId))
            .unwrap()
            .then((): void => {
              dispatch(removeMessage(_id as PlantId));
            })
            .catch((rejectedValue: any): void => {
              dispatch(setErrorMessage(rejectedValue.message));
            });
        }
      });
    },

    checkNewRequests(
      loggedInUser: User | null,
      messages: Message[],
      amountOfRequests: number
    ): void {
      const calculateAmountOfRequests = (messages: Message[]): number => {
        const currentAmountOfRequests = messages.filter(
          ({ seller, messageState }: Message): boolean => {
            return (
              (seller as User)._id === (loggedInUser as User)._id &&
              messageState === true
            );
          }
        ).length;
        return currentAmountOfRequests;
      };

      const checkAmountOfRequests = (
        currentAmountOfRequests: number,
        amountOfRequests: number
      ): void => {
        if (amountOfRequests < currentAmountOfRequests) {
          dispatch(setIsNewRequest(true));
        }
        if (amountOfRequests !== currentAmountOfRequests) {
          dispatch(setAmountOfRequests(currentAmountOfRequests));
        }
      };

      const currentAmountOfRequests = calculateAmountOfRequests(messages);
      checkAmountOfRequests(currentAmountOfRequests, amountOfRequests);
    },

    checkNewReplies(
      loggedInUser: User | null,
      messages: Message[],
      amountOfReplies: number
    ): void {
      const calculateAmountOfReplies = (messages: Message[]): number => {
        const currentAmountOfReplies = messages.filter(
          ({ buyer, reply }: Message): boolean => {
            return (
              (buyer as User)._id === (loggedInUser as User)._id && reply !== ""
            );
          }
        ).length;
        return currentAmountOfReplies;
      };

      const checkAmountOfReplies = (
        currentAmountOfReplies: number,
        amountOfReplies: number
      ): void => {
        if (amountOfReplies < currentAmountOfReplies) {
          dispatch(setIsNewReply(true));
        }
        if (amountOfReplies !== currentAmountOfReplies) {
          dispatch(setAmountOfReplies(currentAmountOfReplies));
        }
      };

      const currentAmountOfReplies = calculateAmountOfReplies(messages);
      checkAmountOfReplies(currentAmountOfReplies, amountOfReplies);
    },
  };
  return handleMessage;
};
