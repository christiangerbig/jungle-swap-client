import { useAppSelector } from "../../app/hooks";
import {
  selectLoggedInUser,
  selectMessages,
} from "../../reducer/jungleSwapSlice";
import { Message, User } from "../../app/typeDefinitions";
import RequestTile from "./RequestTile";

const RequestsCollection = (): JSX.Element => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const messages = useAppSelector(selectMessages);

  return (
    <div>
      {messages.map((message: Message): JSX.Element | null => {
        const { _id, seller, messageState } = message;
        return (seller as User)._id === (loggedInUser as User)._id &&
          messageState === true ? (
          <RequestTile message={message} key={_id} />
        ) : null;
      })}
    </div>
  );
};

export default RequestsCollection;
