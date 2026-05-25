type Props = {
  message: string;
};

export const ErrorBanner = ({ message }: Props) => {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-rose-800">
      {message}
    </p>
  );
};
