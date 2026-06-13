import * as React from "react";

const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block">{children}</div>
);

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none ${
      className || ""
    }`}
    {...props}
  />
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end" | "center";
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, align = "start", ...props }, ref) => {
  const alignClass =
    align === "end"
      ? "right-0"
      : align === "center"
      ? "left-1/2 -translate-x-1/2"
      : "left-0";
  return (
    <div
      ref={ref}
      className={`absolute ${alignClass} top-full mt-2 z-50 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-md ${
        className || ""
      }`}
      {...props}
    />
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClick?: () => void }
>(({ className, onClick, ...props }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    className={`flex items-center rounded px-2 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
      className || ""
    }`}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`my-1 h-px bg-gray-200 ${className || ""}`}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
