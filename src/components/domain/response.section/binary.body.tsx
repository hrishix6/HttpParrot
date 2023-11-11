export function BinaryBody() {
  return (
    <div className="absolute top-0 left-0 h-full w-full flex flex-col gap-2 items-center justify-center">
      <img src="logo.svg" className="h-10 w-10" />
      <h4 className="text-muted-foreground font-semibold text-lg text-center">
        Preview is unavailable for binary and unsupported text formats. To
        access the file, simply download it using the dropdown menu located in
        the top right corner.
      </h4>
    </div>
  );
}
