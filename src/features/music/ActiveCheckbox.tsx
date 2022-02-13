import * as React from "react";
import { Checkbox } from "@fluentui/react";

interface ActiveCheckboxProps {
  active: boolean;
  onChange: (newValue: boolean) => void;
}

const ActiveCheckbox = (props: ActiveCheckboxProps): React.ReactElement => {
  const { active, onChange } = props;

  return (
    <Checkbox
      checked={active}
      boxSide="end"
      styles={{
        root: {
          marginLeft: "0.75em",
        },
      }}
      onChange={() => {
        onChange(!active);
      }}
    />
  );
};

export default ActiveCheckbox;
