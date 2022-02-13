import * as React from "react";
import ResultMessage from "../results/ResultMessage";
import { Stack } from "@fluentui/react";
import { cryptoMode } from "../cryptoUtilities";

interface Props {
  message: string;
  cryptoFunction: (message: string, mode: cryptoMode) => string;
}

const ResultPair = ({ message, cryptoFunction }: Props): React.ReactElement => {
  return (
    <Stack horizontal style={{ width: "100%" }}>
      <Stack
        grow
        horizontal
        horizontalAlign="center"
        style={{ maxWidth: "50%", paddingRight: "0.25em" }}
      >
        <ResultMessage
          message={cryptoFunction(message, "encode")}
          extraStyle={{ fontFamily: "monospace" }}
        />
      </Stack>
      <Stack
        grow
        horizontal
        horizontalAlign="center"
        style={{ maxWidth: "50%", paddingLeft: "0.25em" }}
      >
        <ResultMessage message={cryptoFunction(message, "decode")} />
      </Stack>
    </Stack>
  );
};

export default ResultPair;
