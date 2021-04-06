import React from "react";

export function LeftSpacer({ children }: { children?: React.ReactNode }) {
  return <div className="w-32 flex-shrink-0 max-w-[25%]">{children}</div>;
}
