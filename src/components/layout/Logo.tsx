/**
 * Renders the site logo with title and author information.
 * Displays "Frank's Book Log" as the main title with "by Frank Showalter" subtitle.
 * Includes hover effects and responsive typography.
 *
 * @param props - The component props
 * @param props.className - Optional additional CSS classes to apply to the logo container
 * @returns A JSX element containing the site logo and branding
 */
export function Logo({ className }: { className?: string }): React.JSX.Element {
  return (
    <div
      className={`
        flex transform-gpu flex-col transition-all duration-500
        has-[a:hover]:text-accent
        ${className ?? ""}
      `}
    >
      <div
        className={`
          text-[1.375rem]/8 font-normal whitespace-nowrap
          tablet:text-[1.5625rem]
        `}
      >
        <a href="/">Frank&apos;s Book Log</a>
      </div>
      <p className={"w-full pl-px text-sm/4 italic opacity-85"}>
        by Frank Showalter
      </p>
    </div>
  );
}
