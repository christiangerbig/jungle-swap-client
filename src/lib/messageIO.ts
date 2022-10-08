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
import {
  Message,
  MessageId,
  Plant,
  PlantId,
  User,
} from "../typeDefinitions";

export class MessageIO {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  create = (newMessage: Message, callbackFunction: Function): void => {
    this.dispatch(setIsCreatingMessage(true));
    this.dispatch(createMessage(newMessage))
      .unwrap()
      .then((message: Message): void => {
        this.dispatch(addMessage(message));
        callbackFunction();
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  fetch = (messageId: MessageId, callbackFunction: Function): void => {
    this.dispatch(setIsFetchingMessage(true));
    this.dispatch(fetchMessage(messageId))
      .unwrap()
      .then((message: Message): void => {
        this.dispatch(setMessage(message));
        callbackFunction();
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  fetchAll = (callbackFunction: Function): void => {
    this.dispatch(setIsFetchingMessages(true));
    this.dispatch(fetchAllMessages())
      .unwrap()
      .then((messages: Message[]): void => {
        this.dispatch(setMessages(messages));
        callbackFunction();
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  fetchCheck = (callbackFunction: Function): void => {
    this.dispatch(fetchAllMessages())
      .unwrap()
      .then((messages: Message[]): void => {
        this.dispatch(setMessages(messages));
        callbackFunction(messages);
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  update = (
    messageId: MessageId,
    updatedMessage: Message,
    callbackFunction: Function
  ): void => {
    this.dispatch(setIsUpdatingMessage(true));
    this.dispatch(updateMessage({ messageId, updatedMessage }))
      .unwrap()
      .then((message: Message): void => {
        this.dispatch(setMessageChanges(message));
        callbackFunction();
      })
      .catch((rejectedValue: any): void => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  delete = (messageId: MessageId, callbackFunction: Function): void => {
    this.dispatch(setIsDeletingMessage(true));
    this.dispatch(deleteMessage(messageId))
      .unwrap()
      .then(() => {
        this.dispatch(removeMessage(messageId));
        callbackFunction();
      })
      .catch((rejectedValue: any) => {
        this.dispatch(setErrorMessage(rejectedValue.message));
      });
  };

  deleteRemaining = (
    messages: Message[],
    plantId: PlantId,
  ): void => {
    messages.forEach(({ _id, plant }: Message): void => {
      if ((plant as Plant)._id === plantId) {
        this.dispatch(setIsDeletingMessage(true));
        this.dispatch(deleteMessage(_id as PlantId))
          .unwrap()
          .then(() => {
            this.dispatch(removeMessage(_id as PlantId));
          })
          .catch((rejectedValue: any): void => {
            this.dispatch(setErrorMessage(rejectedValue.message));
          });
      }
    });
  };

  checkNewRequests = (
    loggedInUser: User | null,
    messages: Message[],
    amountOfRequests: number
  ): void => {
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
