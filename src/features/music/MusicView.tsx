import React from "react";
import { IColumn, ProgressIndicator, ScrollablePane } from "@fluentui/react";
import styles from "./MusicView.css";
import HeaderCommandBar from "./HeaderCommandBar";
import SongDataList from "./SongDataList";
import { SongData } from "./MusicTypes";
import { useMusicData } from "../../contexts/useMusicData";

const MusicView = () => {
  const {
    isLoading,
    saveFilePath,
    songs,
    sortColumns,
    viewOptions,
    updateSong,
    toggleAndApplySortColumn,
  } = useMusicData();

  const windowTitle = `MC-Manager${saveFilePath === "" ? "" : ` - ${saveFilePath}`}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <HeaderCommandBar />
      </div>
      <div className={styles.main}>
        <ScrollablePane>
          {isLoading ? (
            <ProgressIndicator barHeight={4} />
          ) : (
            <SongDataList
              songs={songs}
              onSongChange={(newSong: SongData) => {
                updateSong(newSong);
              }}
              onColumnClick={(ev?: React.MouseEvent<HTMLElement>, column?: IColumn) => {
                if (typeof column !== "undefined" && typeof column.fieldName !== "undefined") {
                  toggleAndApplySortColumn(column.fieldName);
                }
              }}
              sortColumns={sortColumns}
              viewOptions={viewOptions}
            />
          )}
        </ScrollablePane>
      </div>
    </div>
  );
};

export default MusicView;
