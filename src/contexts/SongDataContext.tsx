import * as React from "react";
import { SongData } from "../constants/MusicTypes";
import { parseCSVFile } from "../utils/FileUtilities";
import { isDefinedString } from "../utils/StringUtilities";

export interface SongDataContextType {
  isLoading: boolean;
  songs: SongData[];
  triggerFileLoad: () => void;
  // TODO add functions to add/modify songs
}

export const SongDataContext = React.createContext<SongDataContextType>({
  isLoading: false,
  songs: [],
  triggerFileLoad: () => null,
});

export const SongDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [fileName, setFileName] = React.useState<string>();
  const [isLoadingFile, setIsLoadingFile] = React.useState(false);
  const [isParsingData, setIsParsingData] = React.useState(false);
  const [rawCSVText, setRawCSVText] = React.useState<string>();
  const [songs, setSongs] = React.useState<SongData[]>([]);
  // const [cachedSongs, setCachedSongs] = React.useState<SongData[]>([]);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      if (isDefinedString(fileName)) {
        setIsLoadingFile(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result;
          if (isDefinedString(text)) {
            setRawCSVText(text);
          }
        };
        setIsLoadingFile(false);
      }
    }
    fetchData();
  }, [fileName]);

  React.useEffect(() => {
    async function parseData() {
      if (isDefinedString(rawCSVText)) {
        setIsParsingData(true);
        const parsed = await parseCSVFile(rawCSVText);
        setSongs(parsed);
        setIsParsingData(false);
      }
    }
    parseData();
  }, [rawCSVText]);

  const handleFileUpload = (e: React.FormEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (files && files.length) {
      setFileName(files[0].name);
    }
  };

  const state = React.useMemo(
    () => ({
      isLoading: isLoadingFile || isParsingData,
      songs,
      triggerFileLoad: () => {
        inputRef.current?.click();
      },
    }),
    [isLoadingFile, isParsingData, songs]
  );

  return (
    <SongDataContext.Provider value={state}>
      {children}
      <div>
        <input
          style={{ display: "none" }}
          accept=".csv"
          ref={inputRef}
          onChange={handleFileUpload}
          type="file"
        />
      </div>
    </SongDataContext.Provider>
  );
};

export const useSongDataContext = (): SongDataContextType => React.useContext(SongDataContext);
