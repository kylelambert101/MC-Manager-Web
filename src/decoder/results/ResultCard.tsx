import * as React from "react";
import { Label, Stack, getId } from "@fluentui/react";
import { Card } from "@uifabric/react-cards";
import { Text } from "office-ui-fabric-react/lib/Text";

interface Props {
  label: string;
  children?: React.ReactNode;
  labelFriends?: () => React.ReactNode;
}

const ResultCard = ({ label, children, labelFriends }: Props) => {
  const resultId = getId("result");

  return (
    <Card
      aria-label={`${label} Results Card`}
      horizontal
      tokens={{ childrenMargin: 12, maxWidth: "100%" }}
      style={{ backgroundColor: "white" }}
    >
      <Card.Item
        styles={{
          root: {
            width: "95%",
          },
        }}
      >
        <Stack
          horizontal
          horizontalAlign="space-between"
          tokens={{ childrenGap: "1em" }}
        >
          <Label htmlFor={resultId}>
            <Text
              variant="mediumPlus"
              style={{ color: "#0063B1", fontWeight: "bold" }}
            >
              {label}
            </Text>
          </Label>
          {typeof labelFriends !== "undefined" && labelFriends()}
        </Stack>
        <Stack id={resultId} horizontalAlign="center" style={{ width: "100%" }}>
          {children}
        </Stack>
      </Card.Item>
    </Card>
  );
};

export default ResultCard;
