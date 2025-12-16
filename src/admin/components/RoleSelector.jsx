import { __ } from "@wordpress/i18n";
import { CheckboxControl } from "@wordpress/components";

const RoleSelector = ({ selectedRoles = [], onChange, label }) => {
  const roles = window.acsbData?.roles || [];

  const handleToggle = (roleValue, checked) => {
    const updated = checked
      ? [...selectedRoles, roleValue]
      : selectedRoles.filter((r) => r !== roleValue);

    onChange(updated);
  };

  const isSelected = (roleValue) => {
    return selectedRoles.includes(roleValue);
  };

  return (
    <div className="role-selector">
      {label && <div className="text-sm font-medium mb-2">{label}</div>}

      <div className="space-y-2">
        {roles.map((role) => (
          <CheckboxControl
            key={role.value}
            label={role.label}
            checked={isSelected(role.value)}
            onChange={(checked) => handleToggle(role.value, checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
