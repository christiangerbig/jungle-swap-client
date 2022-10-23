import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { Message, User } from "../../app/typeDefinitions";
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
      {messages.map((message: Message): JSX.Element | null => {
        const { _id, buyer, reply } = message;
        return (buyer as User)._id === (loggedInUser as User)._id &&
          reply !== "" ? (
          <ReplyTile message={message} key={_id} />
        ) : null;
      })}
    </div>
  );
};

export default RepliesCollection;
