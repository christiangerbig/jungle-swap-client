import {
  deleteMessage,
  fetchAllMessages,
  fetchMessage,
  removeMessage,
  setErrorMessage,
  setIsDeletingMessage,
  setIsFetchingMessage,
  setIsFetchingMessages,
  setMessage,
  setMessages,
} from "../reducer/jungleSwapSlice";
import { Message, MessageId, Plant, PlantId } from "../typeDefinitions";

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
}
