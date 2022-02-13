import * as React from "react";
import { getA1Z26Result } from "../cryptoUtilities";
import ResultCard from "../results/ResultCard";
import ResultPair from "../results/ResultPair";

interface Props {
  message: string;
}

const A1Z26Card = ({ message }: Props): React.ReactElement => {
  return (
    <ResultCard label="A1Z26 Cipher Results">
      <ResultPair
        message={message}
        cryptoFunction={(message, mode) => getA1Z26Result(message, "-", mode)}
      />
    </ResultCard>
  );
};

export default A1Z26Card;
