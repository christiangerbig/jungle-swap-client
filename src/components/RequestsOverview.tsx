import { useAppSelector } from "../hooks";
import { RootState } from "../store";
import { Message, User } from "../typeDefinitions";
import RequestTile from "./RequestTile";

const RequestsOverview = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const messages = useAppSelector(
    (state: RootState) => state.jungleSwap.messages
  );

  return (
    <div>
      {messages.map((message: Message, index: number): JSX.Element => {
        const { seller, messageState } = message;
        return (seller as User)._id === (loggedInUser as User)._id &&
          messageState === true ? (
          <RequestTile message={message} key={index} />
        ) : (
          <></>
        );
      })}
    </div>
  );
};

export default RequestsOverview;
