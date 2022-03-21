import { useAppSelector } from "../hooks";
import { RootState } from "../store";
import { Message, User } from "../typeDefinitions";
import ReplyTile from "../components/ReplyTile";

const RepliesCollection = () => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const messages = useAppSelector(
    (state: RootState) => state.jungleSwap.messages
  );

  return (
    <div>
      {messages.map((message: Message, index: number): JSX.Element => {
        const { buyer, reply } = message;
        return (buyer as User)._id === (loggedInUser as User)._id &&
          reply !== "" ? (
          <ReplyTile message={message} key={index} />
        ) : (
          <></>
        );
      })}
    </div>
  );
};

export default RepliesCollection;
