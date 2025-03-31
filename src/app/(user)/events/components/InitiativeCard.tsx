import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Initiative } from "~/lib/types/events";

interface InitiativeCardProps {
  initiative: Initiative;
}

export function InitiativeCard({ initiative }: InitiativeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{initiative.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground">{initiative.description}</div>
      </CardContent>
    </Card>
  );
}
