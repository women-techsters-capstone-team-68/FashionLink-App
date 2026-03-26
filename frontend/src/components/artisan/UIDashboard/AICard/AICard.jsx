import Icon from "../../../Icon.jsx";
import "./AICard.css";

export default function AICard({ title, children, variant = "default" }) {
  return (
    <div className={`ac ac--${variant}`}>
      <div className="ac__header">
        <span className="ac__star">
          <Icon name="star" />
        </span>
        <h3 className="ac__title">{title}</h3>
        <span className="ac__badge">AI</span>
      </div>
      <div className="ac__body">{children}</div>
    </div>
  );
}