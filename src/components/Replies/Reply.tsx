interface ReplyProps {
  headline: string;
  text: string | undefined;
}

const Reply = ({ headline, text }: ReplyProps): JSX.Element | null => {
  if (!text) {
    return null;
  }

  return (
    <div>
      <h5>{headline}</h5>
      <p className="text-field p-3 mb-4">{text}</p>
    </div>
  );
};

export default Reply;
