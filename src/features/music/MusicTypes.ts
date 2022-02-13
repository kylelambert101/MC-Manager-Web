export type SongData = {
  id: number;
  active: boolean;
  date: string;
  day: string;
  title: string;
  new_file_name: string;
  original_file_name: string;
  original_file_path: string;
  file_extension: string;
  artist: string;
  album: string;
  album_artist: string;
  track_number: number;
  track_total: number;
  duration: number;
};

export interface SongDataColumn {
  name: string;
  displayName: string;
  csvHeaderName: string;
  dataType: string;
}

export interface ViewOptions {
  /**
   * Fade text of rows where active is false
   */
  fadeInactive: boolean;

  /**
   * List of columns to be hidden from view
   */
  hiddenColumns: SongDataColumn[];
}
