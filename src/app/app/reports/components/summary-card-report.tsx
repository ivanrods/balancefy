import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryCardReportProps = {
  title: string;
  value: string;
  positive?: boolean;
};

export default function SummaryCardReport({
  title,
  value,
  positive,
}: SummaryCardReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-xl font-semibold ${
            positive ? "text-chart-2" : "text-primary"
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
