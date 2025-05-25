
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader className={`${sizeClasses[size]} animate-spin text-purple-500`} />
      {text && <p className="mt-2 text-gray-400 text-sm">{text}</p>}
    </div>
  );
}
