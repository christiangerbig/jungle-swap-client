import { useAppSelector } from "../hooks";
import { RootState } from "../store";

type MessageOutputProps = {
  printErrorMessage: Function;
};

const MessageOutput = ({
  printErrorMessage,
}: MessageOutputProps): JSX.Element => {
  const errorMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.errorMessage
  );

  return (
    <>
      <span className="is-danger is-text-bold is-display-block">
        {printErrorMessage(errorMessage)}
      </span>
    </>
  );
};

export default MessageOutput;
