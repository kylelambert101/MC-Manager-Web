import * as React from "react";
import { getVigenereResult } from "../cryptoUtilities";
import { TextField } from "@fluentui/react";
import ResultCard from "../results/ResultCard";
import ResultPair from "../results/ResultPair";

interface Props {
  message: string;
}

const VigenereCard = ({ message }: Props) => {
  const [key, setKey] = React.useState("SECRET_KEY");

  const handleKeyChange = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newKey?: string | undefined
  ) => {
    if (typeof newKey !== "undefined") setKey(newKey.toUpperCase());
  };

  return (
    <ResultCard
      label="Vigenère Cipher Results"
      labelFriends={(): React.ReactElement => (
        <TextField
          label="Key"
          value={key}
          onChange={handleKeyChange}
          underlined
          style={{ width: 100 }}
        />
      )}
    >
      <ResultPair
        message={message}
        cryptoFunction={(message, mode) =>
          getVigenereResult(message, key, mode)
        }
      />
    </ResultCard>
  );
};

export default VigenereCard;
