export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    "needs-change": "bg-orange-100 text-orange-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium uppercase ${styles[status]}`}
    >
      {status.replace("-", " ")}
    </span>
  )
}
