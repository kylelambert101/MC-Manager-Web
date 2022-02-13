import React from "react";
import { IColumn, ProgressIndicator, ScrollablePane } from "@fluentui/react";
import HeaderCommandBar from "./HeaderCommandBar";
import SongDataList from "./SongDataList";
import { SongData } from "./MusicTypes";
import { useMusicData } from "../../contexts/useMusicData";

const MusicView = () => {
  const {
    isLoading,
    // saveFilePath,
    songs,
    sortColumns,
    viewOptions,
    updateSong,
    toggleAndApplySortColumn,
  } = useMusicData();

  // const windowTitle = `MC-Manager${saveFilePath === "" ? "" : ` - ${saveFilePath}`}`;

  return (
    /*
     * Configuration for DetailsList with header came from from:
     * https://stackoverflow.com/a/53527580/6509903
     */
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "absolute",
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ flex: 0 }}>
        <HeaderCommandBar />
      </div>
      <div style={{ flex: 1, position: "relative" }}>
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
