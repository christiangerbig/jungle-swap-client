import {
  deleteMessage,
  fetchAllMessages,
  fetchMessage,
  removeMessage,
  setAmountOfReplies,
  setAmountOfRequests,
  setErrorMessage,
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

export class MessageIO {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  fetch = (messageId: MessageId): void => {
    this.dispatch(setIsFetchingMessage(true));
    this.dispatch(fetchMessage(messageId))
      .unwrap()
      .then((message: Message) => {
        this.dispatch(setMessage(message));
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  fetchAll = (): void => {
    this.dispatch(setIsFetchingMessages(true));
    this.dispatch(fetchAllMessages())
      .unwrap()
      .then((messages: Message[]) => {
        this.dispatch(setMessages(messages));
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  fetchCheck = (): void => {
    this.dispatch(fetchAllMessages())
      .unwrap()
      .then((messages: Message[]) => {
        this.dispatch(setMessages(messages));
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  deleteRemaining = (messages: Message[], plantId: PlantId): void => {
    messages.forEach((message: Message): void => {
      const { _id, plant } = message;
      if ((plant as Plant)._id === plantId) {
        this.dispatch(setIsDeletingMessage(true));
        this.dispatch(deleteMessage(_id as PlantId))
          .unwrap()
          .then(() => {
            this.dispatch(removeMessage(_id as PlantId));
          })
          .catch((rejectedValue: any) => {
            this.dispatch(setErrorMessage(rejectedValue.message));
          });
      }
    });
  };

  delete = (messageId: MessageId): void => {
    this.dispatch(setIsDeletingMessage(true));
    this.dispatch(deleteMessage(messageId))
      .unwrap()
      .then(() => {
        this.dispatch(removeMessage(messageId));
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  update = (messageId: MessageId, updatedMessage: Message): void => {
    this.dispatch(setIsUpdatingMessage(true));
    this.dispatch(updateMessage({ messageId, updatedMessage }))
      .unwrap()
      .then((message: Message) => {
        this.dispatch(setMessageChanges(message));
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  checkNewRequests = (
    loggedInUser: User | null,
    messages: Message[],
    amountOfRequests: number
  ): void => {
    const calculateAmountOfRequests = (messages: Message[]): number => {
      const currentAmountOfRequests = messages.filter(
        (message: Message): boolean => {
          const { seller, messageState } = message;
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
        this.dispatch(setIsNewRequest(true));
      }
      if (amountOfRequests !== currentAmountOfRequests) {
        this.dispatch(setAmountOfRequests(currentAmountOfRequests));
      }
    };

    const currentAmountOfRequests = calculateAmountOfRequests(messages);
    checkAmountOfRequests(currentAmountOfRequests, amountOfRequests);
  };

  checkNewReplies = (
    loggedInUser: User | null,
    messages: Message[],
    amountOfReplies: number
  ): void => {
    const calculateAmountOfReplies = (messages: Message[]): number => {
      const currentAmountOfReplies = messages.filter(
        (message: Message): boolean => {
          const { buyer, reply } = message;
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
        this.dispatch(setIsNewReply(true));
      }
      if (amountOfReplies !== currentAmountOfReplies) {
        this.dispatch(setAmountOfReplies(currentAmountOfReplies));
      }
    };

    const currentAmountOfReplies = calculateAmountOfReplies(messages);
    checkAmountOfReplies(currentAmountOfReplies, amountOfReplies);
  };
}
