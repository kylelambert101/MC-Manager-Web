import fs from "fs";
import { SongData } from "../features/music/MusicTypes";
import {
  parseSongDataFromCSVRow,
  isCSVHeaderValid,
  expectedCSVColumnOrder,
  convertSongDataToCSVRow,
  getCSVRowsFromString,
} from "./CSVUtilities";

// Default file encoding to use for read/write
const encoding = "utf8";

const getFileContents = (filePath: string): string | undefined => {
  console.log(`Opening file: "${filePath}"`);

  // detectCharacterEncoding used native module that was difficult to manage in electron
  // const fileBuffer = fs.readFileSync(filePath);
  // const detectedEncoding = detectCharacterEncoding(fileBuffer)?.encoding;
  // if (detectedEncoding) {
  //   console.log(`Detected encoding "${detectedEncoding}"`);
  //   // If encoding detection worked
  //   if (detectedEncoding.startsWith('ISO')) {
  //     encoding = 'ascii';
  //     console.log(`Remapped encoding "${detectedEncoding}" to "${encoding}"`);
  //   } else {
  //     encoding = detectedEncoding;
  //   }
  // } else {
  //   // If encoding detection didn't work
  //   encoding = 'utf-8';
  //   console.log(`No encoding detected. Using default "${encoding}".`);
  // }

  let results;
  try {
    results = fs.readFileSync(filePath, encoding);
  } catch (err) {
    console.log(
      `Tried reading file "${filePath}" with encoding "${encoding}". Resulted in error: ${
        (err as Error).message
      }`
    );
    throw err;
  }
  return results;
};

// eslint-disable-next-line import/prefer-default-export
export const loadCSVFile = async (filePath: string): Promise<SongData[]> => {
  // TODO This function freezes the page for large files - can it be extracted to a worker thread?
  const data = getCSVRowsFromString(getFileContents(filePath) || "");

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

  try {
    fs.writeFileSync(targetPath, csvData, { encoding });
  } catch (err) {
    console.log(`Error writing data to ${targetPath}`);
    console.log(csvData);
    throw err;
  }
};
