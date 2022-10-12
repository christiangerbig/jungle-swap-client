import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";

type ErrorMessageOutputProps = {
  outputFunction: Function;
};

const ErrorMessageOutput = ({
  outputFunction,
}: ErrorMessageOutputProps): JSX.Element => {
  const errorMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.errorMessage
  );

  return (
    <>
      <span className="is-danger is-text-bold is-display-block">
        {outputFunction(errorMessage)}
      </span>
    </>
  );
};

export default ErrorMessageOutput;
