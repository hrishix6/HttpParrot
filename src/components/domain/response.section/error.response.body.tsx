interface Props {
  message: string;
}
export function ErrorBody({ message }: Props) {
  return (
    <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center">
      <img src="logo.danger.svg" className="h-10 w-10" />
      <p className="text-lg text-muted-foreground font-semibold p-1 text-center">
        {message}
      </p>
    </div>
  );
}
