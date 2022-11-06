type PaymentErrorMessageProps = {
  errorMessage: string;
};

const PaymentErrorMessage = ({
  errorMessage,
}: PaymentErrorMessageProps): JSX.Element | null => {
  if (!errorMessage) {
    return null;
  }

  return (
    <div role="alert" className="card-error">
      {errorMessage}
    </div>
  );
};

export default PaymentErrorMessage;
