export function Abandoned({
  className,
  value,
}: {
  className?: string;
  value: string | undefined;
}) {
  if (value !== "Abandoned") {
    return false;
  }

  return (
    <div
      className={`
        rounded-sm bg-abandoned px-2 py-1 font-sans text-xxs font-semibold
        text-inverse uppercase
        ${className}
      `}
    >
      Abandoned
    </div>
  );
}
