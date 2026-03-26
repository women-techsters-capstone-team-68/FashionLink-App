import "./StatusBadge.css";

// Maps status string → CSS modifier token
const STATUS_MAP = {
  "Delayed":     "delayed",
  "Assigned":    "assigned",
  "In Progress": "inprogress",
  "Completed":   "completed",
};

export default function StatusBadge({ status }) {
  const modifier = STATUS_MAP[status] || "default";
  return (
    <span className={`sb sb--${modifier}`}>
      <span className="sb__dot" />
      {status}
    </span>
  );
}
