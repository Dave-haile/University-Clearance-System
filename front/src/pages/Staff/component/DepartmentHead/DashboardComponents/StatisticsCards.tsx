
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

interface StatisticsCardsProps {
  statistics: {
    total: number | null;
    pending: number | null;
    approved: number | null;
    rejected: number | null;
  };
}

export const StatisticsCards = ({ statistics }: StatisticsCardsProps) => {
  const cards = [
    {
      title: "Total Requests",
      value: statistics.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Requests",
      value: statistics.pending,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      title: "Approved Requests",
      value: statistics.approved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Rejected Requests",
      value: statistics.rejected,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
