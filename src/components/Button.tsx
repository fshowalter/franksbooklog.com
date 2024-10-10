import { ccn } from "~/utils/concatClassNames";

export function Button({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      className={ccn(
        "mx-auto w-full max-w-button bg-canvas py-5 text-center font-sans text-xs font-semibold uppercase tracking-wide shadow-all hover:bg-inverse hover:text-inverse",
        className,
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
