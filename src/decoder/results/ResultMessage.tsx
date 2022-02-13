import * as React from "react";
import { Text } from "office-ui-fabric-react/lib/Text";
import { isWord } from "../cryptoUtilities";

export interface Props {
  message: string;
  extraStyle?: React.CSSProperties;
}

const ResultMessage = ({ message, extraStyle }: Props): React.ReactElement => {
  return (
    <span>
      {message.length > 0 ? (
        message.split(" ").map((word) =>
          isWord(word) ? (
            <Text
              variant="mediumPlus"
              style={{ ...extraStyle, color: "#6B69D6", fontWeight: "bold" }}
            >
              {word}{" "}
            </Text>
          ) : (
            <Text variant="mediumPlus" style={extraStyle}>
              {word}{" "}
            </Text>
          )
        )
      ) : (
        <Text variant="mediumPlus" style={extraStyle}>
          -
        </Text>
      )}
    </span>
  );
};

export default ResultMessage;
