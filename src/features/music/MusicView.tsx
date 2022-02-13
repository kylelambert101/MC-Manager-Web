import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Fabric,
  IColumn,
  ProgressIndicator,
  ScrollablePane,
} from 'office-ui-fabric-react';
import styles from './MusicView.css';
import HeaderCommandBar from './HeaderCommandBar';
import SongDataList from './SongDataList';
import {
  isLoadingSelector,
  saveFilePathSelector,
  songsSelector,
  updateSong,
  toggleAndApplySortColumn,
  sortColumnsSelector,
  viewOptionsSelector,
} from './musicSlice';
import { SongData } from './MusicTypes';

const MusicView = () => {
  const isLoading = useSelector(isLoadingSelector);
  const filePath = useSelector(saveFilePathSelector);
  const songs = useSelector(songsSelector);
  const sortColumns = useSelector(sortColumnsSelector);
  const viewOptions = useSelector(viewOptionsSelector);
  const dispatch = useDispatch();

  const windowTitle = `MC-Manager${filePath === '' ? '' : ` - ${filePath}`}`;

  return (
    <Fabric className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.titlebar}>{windowTitle}</div>
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
                dispatch(updateSong(newSong));
              }}
              onColumnClick={(
                ev?: React.MouseEvent<HTMLElement>,
                column?: IColumn
              ) => {
                if (
                  typeof column !== 'undefined' &&
                  typeof column.fieldName !== 'undefined'
                ) {
                  dispatch(toggleAndApplySortColumn(column.fieldName));
                }
              }}
              sortColumns={sortColumns}
              viewOptions={viewOptions}
            />
          )}
        </ScrollablePane>
      </div>
    </Fabric>
  );
};

export default MusicView;
