import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';
import { SongData, ViewOptions } from './MusicTypes';
import { loadCSVFile, selectFileToLoad } from '../../utils/FileUtilities';
import { SortField, sortObjectListByFields } from '../../utils/ArrayUtilities';
import songDataFields from '../../constants/songDataFields.json';

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    isLoading: false,
    cachedSongs: [] as SongData[],
    songs: [] as SongData[],
    saveFilePath: '',
    sortColumns: [] as SortField[],
    viewOptions: {
      fadeInactive: false,
      hiddenColumns: [songDataFields.ID],
    } as ViewOptions,
  },
  reducers: {
    beginCSVLoad: (state) => {
      state.isLoading = true;
    },
    receiveCSVLoad: (state, action: PayloadAction<SongData[]>) => {
      const songData = action.payload;
      state.isLoading = false;
      // If no song data comes through, don't change the state
      // -> May represent a "Cancel" of load file dialogue
      if (typeof songData !== 'undefined') {
        state.songs = songData;
        state.cachedSongs = songData;
        // Reset sortColumns upon file load
        state.sortColumns = [];
      }
    },
    cancelCSVLoad: (state) => {
      state.isLoading = false;
    },
    toggleActive: (state, action: PayloadAction<SongData>) => {
      const targetSong = action.payload;
      state.songs = state.songs.map((s) =>
        s.new_file_name === targetSong.new_file_name
          ? { ...s, active: !s.active }
          : s
      );
    },
    updateSong: (state, action: PayloadAction<SongData>) => {
      const targetSong = action.payload;
      state.songs = state.songs.map((s) =>
        s.new_file_name === targetSong.new_file_name ? targetSong : s
      );
    },
    addSongs: (state, action: PayloadAction<SongData[]>) => {
      const minId = Math.min(0, ...state.songs.map((s) => s.id));
      const newSongs = action.payload.map((song, index) => ({
        ...song,
        id: minId - (action.payload.length - index),
      }));

      // Add the new songs to state.songs and reassign ids
      state.songs = [...newSongs, ...state.songs];
    },
    resetSongsFromCached: (state) => {
      state.songs = state.cachedSongs;
    },
    overwriteCachedSongs: (state) => {
      state.cachedSongs = state.songs;
    },
    setSaveFilePath: (state, action: PayloadAction<string>) => {
      state.saveFilePath = action.payload;
    },
    toggleSortColumn: (state, action: PayloadAction<string>) => {
      const columnField = action.payload;
      const column = state.sortColumns.find((c) => c.fieldName === columnField);
      if (typeof column === 'undefined') {
        // Column isn't in the list, add it in asc mode
        state.sortColumns.push({
          fieldName: columnField,
          direction: 'ascending',
        } as SortField);
      } else if (column.direction === 'ascending') {
        // Column is in the list asc -> switch to desc
        column.direction = 'descending';
      } else {
        // Column is in the list desc -> remove it
        state.sortColumns = state.sortColumns.filter((c) => c !== column);
      }
    },
    resetSortColumns: (state) => {
      state.sortColumns = [];
    },
    applySorting: (state) => {
      state.songs = sortObjectListByFields(
        state.songs,
        state.sortColumns.length > 0
          ? state.sortColumns
          : // If no sort columns are specified, use ID
            [{ fieldName: 'id', direction: 'ascending' }]
      ) as SongData[];
    },
    setViewOptions: (state, action: PayloadAction<ViewOptions>) => {
      state.viewOptions = action.payload;
    },
  },
});

// Actions for use in thunks below
const {
  beginCSVLoad,
  receiveCSVLoad,
  cancelCSVLoad,
  applySorting,
  addSongs,
  toggleSortColumn,
  resetSortColumns,
} = musicSlice.actions;

// Actions exported for use elsewhere
export const {
  toggleActive,
  updateSong,
  resetSongsFromCached,
  overwriteCachedSongs,
  setSaveFilePath,
  setViewOptions,
} = musicSlice.actions;

/**
 * Load data from a music_collection csv file into the redux store
 */
export const loadDataFromCSV = (): AppThunk => {
  return async (dispatch) => {
    // Tell the store data will be loaded
    dispatch(beginCSVLoad());

    // Open the file dialogue
    const filePath = await selectFileToLoad();
    if (typeof filePath === 'undefined') {
      // User cancelled the open dialogue. Cancel load
      console.log('No file selected in open dialogue. Abort load process.');
      dispatch(cancelCSVLoad());
      return;
    }

    // Save the selected file path
    dispatch(setSaveFilePath(filePath));

    // Perform actual data loading
    const result = await loadCSVFile(filePath);

    // Tell the store data was received
    dispatch(receiveCSVLoad(result));
  };
};

/**
 * Add a list of new songs to the data collection, obeying sort rules
 * @param songs
 */
export const addNewSongs = (songs: SongData[]): AppThunk => {
  return async (dispatch) => {
    dispatch(addSongs(songs));
    dispatch(applySorting());
  };
};

/**
 * Remove all sort rules and reset data sorting
 */
export const resetSorting = (): AppThunk => {
  return async (dispatch) => {
    dispatch(resetSortColumns());
    dispatch(applySorting());
  };
};

/**
 * Toggle the sort state of a column and apply updated sort rules
 * to the dataset
 *
 * @param field
 */
export const toggleAndApplySortColumn = (field: string): AppThunk => {
  return async (dispatch) => {
    dispatch(toggleSortColumn(field));
    dispatch(applySorting());
  };
};

export default musicSlice.reducer;

export const isLoadingSelector = (state: RootState) => state.music.isLoading;
export const songsSelector = (state: RootState) => state.music.songs;
export const cachedSongsSelector = (state: RootState) =>
  state.music.cachedSongs;
export const saveFilePathSelector = (state: RootState) =>
  state.music.saveFilePath;
export const sortColumnsSelector = (state: RootState) =>
  state.music.sortColumns;
export const viewOptionsSelector = (state: RootState) =>
  state.music.viewOptions;
