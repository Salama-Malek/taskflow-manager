interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
}

const Logo = ({ variant = "full", className }: LogoProps) => {
  if (variant === "icon") {
    return <img src="/favicon.svg" alt="TaskFlow Manager icon" className={className ?? "h-10 w-10"} />;
  }

  return <img src="/logo.svg" alt="TaskFlow Manager logo" className={className ?? "h-12 w-auto"} />;
};

export default Logo;
