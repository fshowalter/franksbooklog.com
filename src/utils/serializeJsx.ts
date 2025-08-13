import type { JSX, ReactElement } from "react";

type ReactElementWithType = ReactElement & {
  $$typeof?: symbol;
  props?: {
    [key: string]: unknown;
    children?: unknown;
  };
  type: ((props: unknown) => JSX.Element) | string | { name?: string };
};

/**
 * Serialize a JSX element to a stable string representation for hashing.
 * This captures the component structure, props, and children.
 */
export function serializeJsx(element: JSX.Element | null | undefined): string {
  if (element == undefined) {
    return "null";
  }

  // Handle primitive values (strings, numbers, booleans)
  if (typeof element !== "object") {
    return JSON.stringify(element);
  }

  // Handle arrays
  if (Array.isArray(element)) {
    return `[${element.map((item) => serializeJsx(item as JSX.Element)).join(",")}]`;
  }

  // Handle React elements
  const reactElement = element as ReactElementWithType;
  if (reactElement.$$typeof) {
    let typeName = "Unknown";
    if (typeof reactElement.type === "function") {
      typeName = reactElement.type.name || "Anonymous";
    } else if (typeof reactElement.type === "string") {
      typeName = reactElement.type;
    } else if (
      typeof reactElement.type === "object" &&
      reactElement.type !== null &&
      "name" in reactElement.type
    ) {
      const typeWithName = reactElement.type as { name?: string };
      typeName = typeWithName.name || "Unknown";
    } else {
      typeName = "Component";
    }

    const props: Record<string, unknown> = {};

    // Process props, excluding children
    if (reactElement.props) {
      const elementProps = reactElement.props as Record<string, unknown>;
      for (const [key, value] of Object.entries(elementProps)) {
        if (key === "children") continue;

        // Serialize prop values
        if (value === null || value === undefined) {
          props[key] = "null";
        } else if (typeof value === "function") {
          // For functions, use their name or a placeholder
          const funcValue = value as { name?: string };
          props[key] = `[Function:${funcValue.name || "anonymous"}]`;
        } else if (typeof value === "object") {
          // For objects and arrays, serialize recursively
          props[key] = JSON.stringify(value);
        } else {
          // Primitives
          props[key] = value;
        }
      }
    }

    // Sort props for deterministic output
    const sortedPropsStr = JSON.stringify(props, Object.keys(props).sort());

    // Serialize children
    const children = reactElement.props?.children;
    const childrenStr = children ? serializeJsx(children as JSX.Element) : "";

    // Combine into a stable string representation
    return `<${typeName}:${sortedPropsStr}>${childrenStr}</${typeName}>`;
  }

  // Fallback for other objects
  try {
    return JSON.stringify(element);
  } catch {
    return "[Object]";
  }
}
