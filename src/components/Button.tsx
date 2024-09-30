import { ccn } from "src/utils/concatClassNames";

export function Button({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={ccn(
        "mx-auto w-full max-w-button bg-canvas py-5 text-center font-sans text-xs font-semibold uppercase tracking-wide shadow-all hover:bg-inverse hover:text-inverse",
        className,
      )}
    >
      {children}
    </button>
  );
}
