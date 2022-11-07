import { useAppSelector } from "../../app/hooks";
import {
  selectLoggedInUser,
  selectMessages,
} from "../../reducer/jungleSwapSlice";
import { Message, User } from "../../app/typeDefinitions";
import ReplyTile from "./ReplyTile";

const RepliesCollection = (): JSX.Element | null => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const messages = useAppSelector(selectMessages);

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
