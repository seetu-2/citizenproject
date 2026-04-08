interface StatusBadgeProps {
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const base = "px-3 py-1 text-sm font-semibold rounded-full";

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Resolved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span className={`${base} ${statusStyles[status]}`}>
      {status}
    </span>
  );
}