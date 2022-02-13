/* eslint-disable react/require-default-props */
import * as React from "react";
import {
  DefaultButton,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  Stack,
  TextField,
  IDialogContentProps,
} from "@fluentui/react";
import SongDataList from "../SongDataList";
import { getCSVRowsFromString, parseSongDataFromCSVRow } from "../../../utils/CSVUtilities";
import { SongData } from "../MusicTypes";
import songDataFields from "../../../constants/songDataFields.json";
import { areIdenticalArrays } from "../../../utils/ArrayUtilities";

interface Props {
  /**
   * Whether or not this dialog is visible
   */
  visible: boolean;

  /**
   * Update function to set the visibility of this dialog
   */
  setVisible: (visible: boolean) => void;

  existingSongs: SongData[];
  onSubmit: (newSongs: SongData[]) => void;
  onCancel?: () => void;
  title?: string;
  message?: string;
}

const AddCSVSongsDialog = (props: Props): React.ReactElement => {
  const { visible, setVisible, onSubmit, onCancel, title, message, existingSongs } = props;

  const [csvInput, setCSVInput] = React.useState([] as string[][]);
  const [parsedSongs, setParsedSongs] = React.useState([] as SongData[]);

  React.useEffect(() => {
    const songs: SongData[] = csvInput
      .map((row, index) => parseSongDataFromCSVRow(row, index + 1))
      // Filter out cases where row could not be parsed
      .filter((song) => typeof song !== "undefined") as SongData[];

    const validSongs: SongData[] = songs.filter((song) => {
      return (
        // Song field set must exactly match defined songDataFields
        areIdenticalArrays(
          Object.keys(song),
          Object.keys(songDataFields).map((field) => Reflect.get(songDataFields, field).name),
          { ignoreOrder: true }
        )
      );
    });
    setParsedSongs(validSongs);
  }, [csvInput, setParsedSongs]);

  const dialogContentProps: IDialogContentProps = {
    type: DialogType.normal,
    title: title || "",
    closeButtonAriaLabel: "Close",
    subText: message,
  };

  const handleSubmit = () => {
    setVisible(false);
    onSubmit(parsedSongs);
    setCSVInput([]);
  };

  const handleCancel = () => {
    setVisible(false);
    // Clear local state
    setCSVInput([]);
    if (typeof onCancel !== "undefined") {
      onCancel();
    }
  };

  const handleTextFieldChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    const csvRows = getCSVRowsFromString(newValue || "").filter(
      // Filter out empty rows
      (row) => !areIdenticalArrays(row, [""])
    );
    if (!areIdenticalArrays(csvInput, csvRows)) {
      setCSVInput(csvRows);
    }
  };

  const getErrorMessage = (): string => {
    // Check which rows were translated to songs
    const invalidRowErrors = csvInput
      .map((row, index) =>
        parsedSongs.some((song) => song.id === index + 1) ? undefined : { id: index + 1, row }
      )
      .filter((item) => typeof item !== "undefined");

    // Show error if there were any invalid rows
    if (invalidRowErrors.length > 0) {
      if (invalidRowErrors.length === 1) {
        const invalidRow = invalidRowErrors[0];
        return `Row ${invalidRow?.id} could not be parsed into a song.`;
      }
      return `The following rows could not be parsed into songs: ${invalidRowErrors
        .map((r) => r?.id)
        .join(", ")}`;
    }
    // Show error if there is any duplicate data (keyed on new_file_name)
    const newFileNames = parsedSongs
      .map((song) => song.new_file_name)
      .filter((nfn, index, self) => self.indexOf(nfn) === index);

    if (newFileNames.length !== parsedSongs.length) {
      const duplicateNames = newFileNames
        .map((newFileName) => {
          return {
            newFileName,
            count: parsedSongs.filter((s) => s.new_file_name === newFileName).length,
          };
        })
        .filter((item) => item.count > 1);
      return `Duplicate data detected. ${duplicateNames
        .map((n) => `"${n.newFileName}" found ${n.count} times`)
        .join("; ")}`;
    }

    const songsAlreadyInFile = newFileNames.filter((fileName) => {
      return existingSongs.some((song) => song.new_file_name === fileName);
    });
    if (songsAlreadyInFile.length > 0) {
      return `Duplicate data detected: ${songsAlreadyInFile.map(
        (s) => `"${s}" already exists in the dataset.`
      )}`;
    }

    return "";
  };

  return (
    <Dialog
      hidden={!visible}
      dialogContentProps={dialogContentProps}
      onDismiss={handleCancel}
      minWidth="80%"
      maxWidth="80%"
    >
      <TextField
        multiline
        autoAdjustHeight
        onChange={handleTextFieldChange}
        onGetErrorMessage={getErrorMessage}
      />
      <h3>Parsed Songs:</h3>
      <SongDataList
        songs={parsedSongs}
        onSongChange={(): boolean => false}
        viewOptions={{
          fadeInactive: false,
          hiddenColumns: [songDataFields.ID],
        }}
      />
      <DialogFooter>
        <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: "10px" }}>
          <PrimaryButton onClick={handleSubmit} text="Submit" disabled={getErrorMessage() !== ""} />
          <DefaultButton onClick={handleCancel} text="Cancel" />
        </Stack>
      </DialogFooter>
    </Dialog>
  );
};
export default AddCSVSongsDialog;
