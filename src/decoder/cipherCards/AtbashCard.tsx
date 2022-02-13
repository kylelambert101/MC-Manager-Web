import * as React from "react";
import { getAtbashResult } from "../cryptoUtilities";
import ResultCard from "../results/ResultCard";
import ResultPair from "../results/ResultPair";

interface Props {
  message: string;
}

const AtbashCard = ({ message }: Props): React.ReactElement => {
  return (
    <ResultCard label="Atbash Cipher Results">
      <ResultPair
        message={message}
        cryptoFunction={(message, mode) => getAtbashResult(message, mode)}
      />
    </ResultCard>
  );
};

export default AtbashCard;
