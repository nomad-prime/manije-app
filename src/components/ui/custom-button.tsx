import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type CustomButtonProps = ComponentProps<typeof Button> & {
  fullWidth?: boolean;
};

export const CustomButton = ({
  className,
  fullWidth,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      className={cn(
        "h-10 px-4 text-sm font-medium min-w-24 hover:-translate-y-0.5 transition-transform duration-300 hover:outline-solid hover:outline-1 " ,
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
};
