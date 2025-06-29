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
        bg-abandoned p-1 font-sans text-xxs font-semibold text-[#fff] uppercase
        ${className}
      `}
    >
      Abandoned
    </div>
  );
}
