/**
 * Renders a styled select input with consistent form styling.
 * Provides a customizable select dropdown with proper styling that matches
 * the site's design system. Includes focus states and accessibility support.
 *
 * @param props - The component props
 * @param props.children - The option elements to render within the select
 * @param props.onChange - Callback function called when selection changes
 * @param props.value - The currently selected value
 * @returns A JSX element containing the styled select input
 */
export function SelectInput({
  children,
  onChange,
  value,
}: {
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: number | string | undefined;
}): React.JSX.Element {
  return (
    <select
      className={`
        w-full appearance-none border-none bg-default py-2 pr-8 pl-4 text-base
        leading-6 text-subtle shadow-all outline-accent
      `}
      onChange={onChange}
      value={value}
    >
      {children}
    </select>
  );
}
