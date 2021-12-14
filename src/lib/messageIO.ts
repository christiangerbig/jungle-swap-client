import {
  fetchAllMessages,
  fetchMessage,
  setIsFetchingMessage,
  setIsFetchingMessages,
  setMessage,
  setMessages,
} from "../reducer/jungleSwapSlice";
import { Message, MessageId } from "../typeDefinitions";

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
        console.log(rejectedValue.message);
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
        console.log(rejectedValue.message);
      });
  };
}
