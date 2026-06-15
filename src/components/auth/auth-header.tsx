interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({
  title,
  description,
}: AuthHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-bold">
        {title}
      </h1>

      <p className="text-muted-foreground text-sm">
        {description}
      </p>
    </div>
  );
}