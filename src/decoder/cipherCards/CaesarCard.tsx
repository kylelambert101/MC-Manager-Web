import * as React from "react";
import { Stack } from "@fluentui/react";
import { codeLetters } from "../cryptoTypes";
import { getCaesarResultWithOffset } from "../cryptoUtilities";
import ResultCard from "../results/ResultCard";
import ResultPair from "../results/ResultPair";

interface Props {
  message: string;
}

const CaesarCard = ({ message }: Props): React.ReactElement => {
  return (
    <ResultCard label="Caesar Cipher Results">
      <Stack tokens={{ childrenGap: "0.25em" }} style={{ width: "100%" }}>
        {codeLetters.map((letter, index) => (
          <Stack.Item key={`${letter}OffsetResult`}>
            <ResultPair
              message={message}
              cryptoFunction={(message, mode) =>
                getCaesarResultWithOffset(message, index + 1, mode)
              }
            />
          </Stack.Item>
        ))}
      </Stack>
    </ResultCard>
  );
};

export default CaesarCard;
