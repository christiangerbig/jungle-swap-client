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
} from "../../reducer/jungleSwapSlice";
import { Message, MessageId, Plant, PlantId, User } from "../typeDefinitions";

interface MessageMethods {
  createMessage: (newMessage: Message, callback: () => void) => void;
  fetchMessage: (messageId: MessageId, callback: () => void) => void;
  fetchMessages: (callback: () => void) => void;
  fetchCheck: (callback: (messages: Message[]) => void) => void;
  updateMessage: (updatedMessage: Message, callback: () => void) => void;
  deleteMessage: (messageId: MessageId, callback: () => void) => void;
  deleteRemainingMessages: (messages: Message[], plantId: PlantId) => void;
  checkNewRequests: (
    user: User,
    messages: Message[],
    amountOfRequests: number
  ) => void;
  checkNewReplies: (
    user: User,
    messages: Message[],
    amountOfReplies: number
  ) => void;
}

export const useMessage = (): MessageMethods => {
  const dispatch = useAppDispatch();

  return {
    createMessage: (newMessage: Message, callback: () => void): void => {
      dispatch(setIsCreatingMessage(true));
      dispatch(createMessage(newMessage))
        .unwrap()
        .then((message: Message): void => {
          dispatch(addMessage(message));
          callback();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    fetchMessage: (messageId: MessageId, callback: () => void): void => {
      dispatch(setIsFetchingMessage(true));
      dispatch(fetchMessage(messageId))
        .unwrap()
        .then((message: Message): void => {
          dispatch(setMessage(message));
          callback();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    fetchMessages: (callback: () => void): void => {
      dispatch(setIsFetchingMessages(true));
      dispatch(fetchAllMessages())
        .unwrap()
        .then((messages: Message[]): void => {
          dispatch(setMessages(messages));
          callback();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    fetchCheck: (callback: (messages: Message[]) => void): void => {
      dispatch(fetchAllMessages())
        .unwrap()
        .then((messages: Message[]): void => {
          dispatch(setMessages(messages));
          callback(messages);
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    updateMessage: (updatedMessage: Message, callback: () => void): void => {
      const { _id } = updatedMessage;
      dispatch(setIsUpdatingMessage(true));
      dispatch(updateMessage({ messageId: _id as MessageId, updatedMessage }))
        .unwrap()
        .then((message: Message): void => {
          dispatch(setMessageChanges(message));
          callback();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    deleteMessage: (messageId: MessageId, callback: () => void): void => {
      dispatch(setIsDeletingMessage(true));
      dispatch(deleteMessage(messageId))
        .unwrap()
        .then((): void => {
          dispatch(removeMessage(messageId));
          callback();
        })
        .catch((rejectedValue: any): void => {
          dispatch(setErrorMessage(rejectedValue.message));
        });
    },

    deleteRemainingMessages(messages: Message[], plantId: PlantId): void {
      messages.forEach(({ _id, plant }: Message): void => {
        if ((plant as Plant)._id === plantId) {
          dispatch(setIsDeletingMessage(true));
          dispatch(deleteMessage(_id as MessageId))
            .unwrap()
            .then((): void => {
              dispatch(removeMessage(_id as MessageId));
            })
            .catch((rejectedValue: any): void => {
              dispatch(setErrorMessage(rejectedValue.message));
            });
        }
      });
    },

    checkNewRequests: (
      { _id }: User,
      messages: Message[],
      amountOfRequests: number
    ): void => {
      const calculateAmountOfRequests = (messages: Message[]): number => {
        const currentAmountOfRequests = messages.filter(
          ({ seller, messageState }: Message): boolean =>
            (seller as User)._id === _id && messageState === true
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

    checkNewReplies: (
      { _id }: User,
      messages: Message[],
      amountOfReplies: number
    ): void => {
      const calculateAmountOfReplies = (messages: Message[]): number => {
        const currentAmountOfReplies = messages.filter(
          ({ buyer, reply }: Message): boolean =>
            (buyer as User)._id === _id && reply !== ""
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
};
