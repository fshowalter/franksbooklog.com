export function Abandoned({ value }: { value: string | undefined }) {
  if (value !== "Abandoned") {
    return false;
  }

  return (
    <div className="bg-abandoned p-1 font-sans text-xxs font-semibold uppercase text-[#fff] tablet:my-1">
      Abandoned
    </div>
  );
}
