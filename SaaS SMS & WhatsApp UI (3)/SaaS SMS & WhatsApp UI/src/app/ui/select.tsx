import * as React from "react";

interface SelectContextValue {
  selectedLabel: string;
  onSelect: (value: string, label: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue>({
  selectedLabel: "",
  onSelect: () => {},
  open: false,
  setOpen: () => {},
});

const Select = ({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (itemValue: string, itemLabel: string) => {
    setSelectedLabel(itemLabel);
    onValueChange?.(itemValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ selectedLabel, onSelect: handleSelect, open, setOpen }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        className || ""
      }`}
      {...props}
    >
      {children}
      <svg
        className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) => {
  const { selectedLabel } = React.useContext(SelectContext);
  return (
    <span className={`text-sm truncate ${className || ""}`}>
      {selectedLabel || (
        <span className="text-gray-400">{placeholder ?? "Select..."}</span>
      )}
    </span>
  );
};
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      ref={ref}
      className={`absolute top-full left-0 right-0 mt-1 rounded-md border border-gray-200 bg-white shadow-lg z-50 max-h-60 overflow-y-auto ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; label?: string }
>(({ className, value, label, children, ...props }, ref) => {
  const { onSelect } = React.useContext(SelectContext);
  // Use explicit label, else string children, else fall back to value
  const displayLabel = label ?? (typeof children === "string" ? children : value);
  return (
    <div
      ref={ref}
      onClick={() => onSelect(value, displayLabel)}
      className={`px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
