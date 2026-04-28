import { Card, CardContent } from "@/components/ui/card";

type LoadStateProps = {
  title: string;
  description?: string;
};

export function LoadingState({ title, description }: LoadStateProps) {
  return (
    <Card className="glass-panel">
      <CardContent className="p-6">
        <p className="text-lg font-semibold">{title}</p>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      </CardContent>
    </Card>
  );
}

export function ErrorState({ title, description }: LoadStateProps) {
  return (
    <Card className="glass-panel border-rose-200">
      <CardContent className="p-6">
        <p className="text-lg font-semibold text-rose-700">{title}</p>
        {description ? <p className="mt-2 text-sm text-rose-600">{description}</p> : null}
      </CardContent>
    </Card>
  );
}
