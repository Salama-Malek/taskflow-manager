interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
}

const Logo = ({ variant = "full", className }: LogoProps) => {
  const assetBase = import.meta.env.BASE_URL;

  if (variant === "icon") {
    return (
      <img
        src={`${assetBase}favicon.svg`}
        alt="TaskFlow Manager icon"
        className={className ?? "h-10 w-10"}
      />
    );
  }

  return (
    <img
      src={`${assetBase}logo.svg`}
      alt="TaskFlow Manager logo"
      className={className ?? "h-12 w-auto"}
    />
  );
};

export default Logo;
