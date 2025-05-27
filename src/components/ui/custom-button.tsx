import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type CustomButtonProps = ComponentProps<typeof Button> & {
  fullWidth?: boolean;
  loading?: boolean;
  nudge?: boolean;
};

export const CustomButton = ({
  className,
  fullWidth,
  loading,
  children,
  nudge,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      className={cn(
        "h-10 px-4 text-sm font-medium min-w-24 transition-transform duration-300 hover:outline-solid hover:outline-1 hover:-outline-offset-1",
        fullWidth && "w-full",
        nudge && "hover:-translate-y-0.5 active:translate-y-0.5",
        className,
      )}
      {...props}
    >
      {children}
      {loading && (
        <span
          className="absolute inset-0 animate-[shimmer_1.8s_infinite_linear]"
          style={{
            background: "linear-gradient(120deg, transparent 0%, var(--glow) 50%, transparent 100%)",
            backgroundSize: "300% 100%",
            opacity: 0.75,
            filter: "blur(6px)",
          }}
        />
      )}
    </Button>
  );
};
