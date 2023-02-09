export const MissingButton = ({ shortcutLabel, buttonLabel }) => (
  <>
    <span className="shortcut">{shortcutLabel}</span>
    {buttonLabel}
    <span className="checked" />
  </>
);
