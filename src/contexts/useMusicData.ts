import songDataFields from "../constants/songDataFields.json";
import { SongData, ViewOptions } from "../features/music/MusicTypes";
import { SortField } from "../utils/ArrayUtilities";

export const useMusicData = () => {
  return {
    isLoading: false,
    cachedSongs: [] as SongData[],
    songs: [] as SongData[],
    saveFilePath: "",
    sortColumns: [] as SortField[],
    viewOptions: {
      fadeInactive: false,
      hiddenColumns: [songDataFields.ID],
    } as ViewOptions,
    updateSong: (song: SongData) => null,
    toggleAndApplySortColumn: (column: string) => null,
    loadDataFromCSV: () => null,
    overwriteCachedSongs: () => null,
    resetSorting: () => null,
    resetSongsFromCached: () => null,
    addNewSongs: (newSongs: SongData[]) => null,
    setViewOptions: (options: ViewOptions) => null,
  };
};
