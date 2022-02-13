import * as React from "react";
import { IStackItemStyles, Stack, TextField } from "@fluentui/react";
import CaesarCard from "./cipherCards/CaesarCard";
import AtbashCard from "./cipherCards/AtbashCard";
import A1Z26Card from "./cipherCards/A1Z26Card";
import VigenereCard from "./cipherCards/VigenereCard";

const DecoderPage = () => {
  const [message, setMessage] = React.useState("");

  const handleMessageChange = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newMessage?: string | undefined
  ) => setMessage(newMessage || "");

  const stackItemStyles: IStackItemStyles = {
    root: { width: "75%" },
  };

  return (
    <Stack
      horizontalAlign="center"
      tokens={{ childrenGap: "1em" }}
      style={{ width: "100%" }}
    >
      <Stack.Item styles={stackItemStyles}>
        <Stack
          horizontal
          horizontalAlign="center"
          style={{ width: "100%", marginTop: "1em" }}
          tokens={{ childrenGap: "1em" }}
        >
          <TextField
            // label="Message"
            value={message}
            onChange={handleMessageChange}
            styles={{ root: { width: "100%" } }}
            placeholder="Enter message to decode"
          />
        </Stack>
      </Stack.Item>
      <Stack.Item styles={stackItemStyles}>
        <AtbashCard message={message} />
      </Stack.Item>
      <Stack.Item styles={stackItemStyles}>
        <A1Z26Card message={message} />
      </Stack.Item>
      <Stack.Item styles={stackItemStyles}>
        <VigenereCard message={message} />
      </Stack.Item>
      <Stack.Item styles={stackItemStyles}>
        <CaesarCard message={message} />
      </Stack.Item>
    </Stack>
  );
};

export default DecoderPage;
