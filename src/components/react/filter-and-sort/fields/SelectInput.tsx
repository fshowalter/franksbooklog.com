/**
 * Base select input component without label.
 * @param props - Component props
 * @param props.children - Option elements to render
 * @param props.defaultValue - Initially selected value
 * @param props.onChange - Change event handler
 * @returns Styled select element
 */
export function SelectInput({
  children,
  defaultValue,
  onChange,
}: {
  children: React.ReactNode;
  defaultValue?: number | string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}): React.JSX.Element {
  return (
    <select
      className={`
        w-full appearance-none border-none bg-default py-2 pr-8 pl-4 text-base/6
        text-subtle shadow-all outline-accent
      `}
      defaultValue={defaultValue}
      key={defaultValue} // work-around for React 19 bug: https://github.com/facebook/react/issues/32362
      onChange={onChange}
    >
      {children}
    </select>
  );
}
