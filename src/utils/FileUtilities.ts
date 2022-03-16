import { SongData } from "../constants/MusicTypes";
import {
  parseSongDataFromCSVRow,
  isCSVHeaderValid,
  expectedCSVColumnOrder,
  convertSongDataToCSVRow,
  getCSVRowsFromString,
} from "./CSVUtilities";

export const parseCSVFile = async (fileContents: string): Promise<SongData[]> => {
  const data = getCSVRowsFromString(fileContents);

  // First row is the header row
  const [header, ...datarows] = data;

  // Check that header rows are in the right position before processing
  if (!isCSVHeaderValid(header)) {
    throw new Error("CSV header columns were not in the expected format");
  }

  // Pop empty lines at the end of the CSV, if any
  while (datarows.length > 0 && datarows[datarows.length - 1].length === 1) {
    datarows.pop();
  }

  // If there's no data, that's a problem.
  if (!datarows || datarows.length === 0) {
    throw new Error("No data found in CSV file");
  }

  return datarows
    .map((row: string[], index: number) => parseSongDataFromCSVRow(row, index + 1))
    .filter((item) => typeof item !== "undefined") as SongData[];
};

export const saveCSVFile = (targetPath: string, songData: SongData[]): void => {
  // Create headers using expectedCSVColumnOrder as a base
  const headers = expectedCSVColumnOrder.map((column) => column.csvHeaderName).join(",");

  const csvData = [
    // Add the headers first
    headers,
    // Then add csv rows for each song
    ...songData.map((song) => convertSongDataToCSVRow(song)),
  ].join("\n");

  console.log(String.raw`Saving not implemented. Here's the data though ¯\_(ツ)_/¯`);
  console.table(csvData);
  // TODO Implement this
};
