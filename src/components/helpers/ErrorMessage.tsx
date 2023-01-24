interface ErrorMessageProps {
  message: string | null;
  outputFunction: Function;
}

const ErrorMessage = ({
  message,
  outputFunction,
}: ErrorMessageProps): JSX.Element | null => {
  if (!message || !message.includes("Form")) {
    return null;
  }

  return (
    <>
      <span className="is-danger is-text-bold is-display-block">
        {outputFunction(message)}
      </span>
    </>
  );
};

export default ErrorMessage;
