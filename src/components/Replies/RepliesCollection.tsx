import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { Message, User } from "../../typeDefinitions";
import ReplyTile from "./ReplyTile";

const RepliesCollection = (): JSX.Element => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const messages = useAppSelector(
    (state: RootState) => state.jungleSwap.messages
  );

  return (
    <div>
      {messages.map((message: Message): JSX.Element => {
        const { _id, buyer, reply } = message;
        return (buyer as User)._id === (loggedInUser as User)._id &&
          reply !== "" ? (
          <ReplyTile message={message} key={_id} />
        ) : (
          <></>
        );
      })}
    </div>
  );
};

export default RepliesCollection;
