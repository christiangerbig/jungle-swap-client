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
      <span className="text-danger font-weight-bold d-block">
        {outputFunction(message)}
      </span>
    </>
  );
};

export default ErrorMessage;
