import Icon from "../../../Icon.jsx";
import "./StatCard.css";

export default function StatCard({ label, value, icon, variant = "default" }) {
  return (
    <div className={`sc sc--${variant}`}>
      <div className="sc__top">
        <span className="sc__value">{value}</span>
        <span className="sc__icon">
          <Icon name={icon} />
        </span>
      </div>
      <p className="sc__label">{label}</p>
    </div>
  );
}