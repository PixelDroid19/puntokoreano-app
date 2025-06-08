import { cn } from "@/utils/utils";
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Ban,
  XCircle 
} from "lucide-react";

type StatusType = "pending" | "processing" | "confirmed" | "delivered" | "cancelled" | "failed";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          bgColor: "bg-amber-100",
          textColor: "text-amber-800",
          borderColor: "border-amber-200",
          label: "Pendiente"
        };
      case "processing":
        return {
          icon: Clock,
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
          label: "Procesando"
        };
      case "confirmed":
        return {
          icon: CheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
          label: "Confirmado"
        };
      case "delivered":
        return {
          icon: CheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
          label: "Entregado"
        };
      case "failed":
        return {
          icon: AlertCircle,
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
          label: "Fallido"
        };
      case "cancelled":
        return {
          icon: Ban,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
          label: "Cancelado"
        };
      default:
        return {
          icon: XCircle,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
          label: "Desconocido"
        };
    }
  };

  const { icon: Icon, bgColor, textColor, borderColor, label } = getStatusConfig();

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border",
      bgColor,
      textColor,
      borderColor,
      className
    )}>
      <Icon size={14} className="shrink-0" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};

export default StatusBadge;
