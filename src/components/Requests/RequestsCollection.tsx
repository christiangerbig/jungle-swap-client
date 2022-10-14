import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { Message, User } from "../../typeDefinitions";
import RequestTile from "./RequestTile";

const RequestsCollection = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const messages = useAppSelector(
    (state: RootState) => state.jungleSwap.messages
  );

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
