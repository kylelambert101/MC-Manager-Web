import * as React from "react";
import { SongData } from "../constants/MusicTypes";
import { sortObjectListByFields } from "../utils/ArrayUtilities";
import { parseCSVFile } from "../utils/FileUtilities";
import { isDefinedString } from "../utils/StringUtilities";
import songDataFields from "../constants/songDataFields.json";
import { useViewOptionsContext } from "./ViewOptionsContext";

export interface SongDataContextType {
  file: File | undefined;
  isLoading: boolean;
  isDirty: boolean;
  songs: SongData[];
  loadFileData: () => void;
  saveFileData: () => void;
  cancelChanges: () => void;
  updateSong: (song: SongData) => void;
  addNewSongs: (newSongs: SongData[]) => void;
}

export const SongDataContext = React.createContext<SongDataContextType>({
  file: undefined,
  isLoading: false,
  isDirty: false,
  songs: [],
  loadFileData: () => null,
  saveFileData: () => null,
  cancelChanges: () => null,
  updateSong: () => null,
  addNewSongs: () => null,
});

export const SongDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [file, setFile] = React.useState<File>();
  const [isLoadingFile, setIsLoadingFile] = React.useState(false);
  const [isParsingData, setIsParsingData] = React.useState(false);
  const [rawCSVText, setRawCSVText] = React.useState<string>();
  const [songs, setSongs] = React.useState<SongData[]>([]);
  const [cachedSongs, setCachedSongs] = React.useState<SongData[]>([]);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const { sortColumns } = useViewOptionsContext();

  React.useEffect(() => {
    async function fetchData() {
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result;
          setIsLoadingFile(true);
          if (isDefinedString(text)) {
            setRawCSVText(text);
          }
          setIsLoadingFile(false);
        };
        reader.readAsText(file);
      }
    }
    fetchData();
  }, [file]);

  React.useEffect(() => {
    async function parseData() {
      if (isDefinedString(rawCSVText)) {
        setIsParsingData(true);
        const parsed = await parseCSVFile(rawCSVText);
        setSongs(parsed);
        setCachedSongs(parsed);
        setIsParsingData(false);
      }
    }
    parseData();
  }, [rawCSVText]);

  React.useEffect(() => {
    setSongs(
      (previousSongs) =>
        sortObjectListByFields(
          previousSongs,
          sortColumns.length > 0
            ? sortColumns
            : [{ fieldName: songDataFields.ID.name, direction: "ascending" }]
        ) as SongData[]
    );
  }, [sortColumns]);

  const handleFileUpload = (e: React.FormEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (files && files.length) {
      setFile(files[0]);
    }
  };

  const isLoading = React.useMemo(
    () => isLoadingFile || isParsingData,
    [isLoadingFile, isParsingData]
  );

  const isDirty = React.useMemo(
    () => JSON.stringify(songs) !== JSON.stringify(cachedSongs),
    [songs, cachedSongs]
  );

  const loadFileData = React.useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  const saveFileData = React.useCallback(() => {
    // TODO Write new data to a csv or download it or something
    setCachedSongs(songs);
  }, [songs]);

  const cancelChanges = React.useCallback(() => {
    setSongs(cachedSongs);
  }, [cachedSongs]);

  const updateSong = React.useCallback((song: SongData) => {
    setSongs((prevSongs) =>
      prevSongs.map((s) => (s.new_file_name === song.new_file_name ? song : s))
    );
  }, []);

  const addNewSongs = React.useCallback(
    (newSongs: SongData[]) => {
      const minId = Math.min(0, ...songs.map((s) => s.id));
      const toAdd = newSongs.map((song, index) => ({
        ...song,
        id: minId - (songs.length - index),
      }));

      // Add the new songs to state.songs and reassign ids
      setSongs([...toAdd, ...songs]);
    },
    [songs]
  );
  const state = React.useMemo(
    () => ({
      file,
      isLoading,
      isDirty,
      songs,
      loadFileData,
      saveFileData,
      cancelChanges,
      updateSong,
      addNewSongs,
    }),
    [
      addNewSongs,
      cancelChanges,
      file,
      isDirty,
      isLoading,
      loadFileData,
      saveFileData,
      songs,
      updateSong,
    ]
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
