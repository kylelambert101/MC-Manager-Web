import * as React from 'react';
import {
  CommandBar,
  ICommandBarItemProps,
} from 'office-ui-fabric-react/lib/CommandBar';
import { useDispatch, useSelector } from 'react-redux';
import { IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { useToasts } from 'react-toast-notifications';
import {
  addNewSongs,
  cachedSongsSelector,
  loadDataFromCSV,
  overwriteCachedSongs,
  resetSongsFromCached,
  saveFilePathSelector,
  songsSelector,
  resetSorting,
  toggleAndApplySortColumn,
  sortColumnsSelector,
  viewOptionsSelector,
  setViewOptions,
} from './musicSlice';
import ConfirmDialog from '../../components/ConfirmDialog';
import { saveCSVFile } from '../../utils/FileUtilities';
import AddCSVSongsDialog from './dialogs/AddCSVSongsDialog';
import { SongData, ViewOptions } from './MusicTypes';
import songDataFields from '../../constants/songDataFields.json';
import ViewOptionsDialog from './dialogs/ViewOptionsDialog';
import PopupModal from './dialogs/PopupModal';

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

const HeaderCommandBar = (): React.ReactElement => {
  const dispatch = useDispatch();
  const songs = useSelector(songsSelector);
  const cachedSongs = useSelector(cachedSongsSelector);
  const savePath = useSelector(saveFilePathSelector);
  const sortColumns = useSelector(sortColumnsSelector);
  const viewOptions = useSelector(viewOptionsSelector);

  const { addToast } = useToasts();

  // Local state for tracking dialog state
  const [cancelDialogIsOpen, setCancelDialogIsOpen] = React.useState(false);
  const [addSongDialogIsOpen, setAddSongDialogIsOpen] = React.useState(false);
  const [viewOptionsDialogIsOpen, setViewOptionsDialogIsOpen] = React.useState(
    false
  );
  const [testIsOpen, setTestIsOpen] = React.useState(false);

  const dataHasChanged = React.useMemo(
    () => JSON.stringify(songs) !== JSON.stringify(cachedSongs),
    [songs, cachedSongs]
  );

  const fileIsOpen = React.useMemo(() => savePath !== '', [savePath]);

  const items: ICommandBarItemProps[] = [
    {
      key: 'upload',
      text: 'Open CSV',
      iconProps: { iconName: 'Database' },
      onClick: () => {
        dispatch(loadDataFromCSV());
      },
    },

    {
      key: 'save',
      text: 'Save CSV',
      iconProps: { iconName: 'PromotedDatabase' },
      onClick: () => {
        saveCSVFile(savePath, songs);
        dispatch(overwriteCachedSongs());
        addToast(`Successfully saved changes to ${savePath}`, {
          appearance: 'success',
        });
      },
      disabled: !dataHasChanged,
    },
    {
      key: 'newItem',
      text: 'Add Songs',
      cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
      iconProps: { iconName: 'Add' }, // MusicNote is another good option
      onClick: () => {
        setAddSongDialogIsOpen(true);
      },
      disabled: !fileIsOpen,
    },
    {
      key: 'sort',
      text: 'Sort',
      iconProps: { iconName: 'SortLines' },
      onClick: (): boolean => false,
      subMenuProps: {
        items: [
          {
            key: 'newestFirst',
            name: 'Newest First',
            text: 'Newest First',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Newest First View',
            iconProps: { iconName: 'SortLines' },
            onClick: () => {
              dispatch(resetSorting());
              dispatch(
                toggleAndApplySortColumn(songDataFields.NEW_FILE_NAME.name)
              );
              dispatch(toggleAndApplySortColumn(songDataFields.DATE.name));
              // Toggle twice so that it switches to descending
              dispatch(toggleAndApplySortColumn(songDataFields.DATE.name));
            },
          },
          {
            key: 'clearSort',
            name: 'Clear Sort',
            text: 'Clear Sort Rules',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Clear Sort Rules',
            iconProps: { iconName: 'RemoveFilter' },
            onClick: () => {
              dispatch(resetSorting());
            },
            disabled: sortColumns.length === 0,
          },
        ],
      },
    },
    {
      key: 'view',
      text: 'View Options',
      iconProps: { iconName: 'View' },
      onClick: () => {
        setViewOptionsDialogIsOpen(true);
      },
    },
    {
      key: 'cancel',
      text: 'Cancel Changes',
      iconProps: { iconName: 'Cancel' },
      onClick: () => {
        setCancelDialogIsOpen(true);
      },
      disabled: !dataHasChanged,
    },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: 'tile',
      text: 'Grid view',
      // This needs an ariaLabel since it's icon-only
      ariaLabel: 'Grid view',
      iconOnly: true,
      iconProps: { iconName: 'Tiles' },
      onClick: () => setTestIsOpen(true),
    },
    {
      key: 'info',
      text: 'Info',
      // This needs an ariaLabel since it's icon-only
      ariaLabel: 'Info',
      iconOnly: true,
      iconProps: { iconName: 'Info' },
      onClick: () => console.log('Info'),
    },
  ];

  return (
    <div>
      <CommandBar
        items={items}
        overflowButtonProps={overflowProps}
        farItems={farItems}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
      <ConfirmDialog
        visible={cancelDialogIsOpen}
        setVisible={setCancelDialogIsOpen}
        message="Are you sure you want to discard all changes?"
        confirmAltText="Yes, discard!"
        cancelAltText="No, go back!"
        onConfirm={() => {
          dispatch(resetSongsFromCached());
          dispatch(resetSorting());
          addToast('Changes discarded', { appearance: 'info' });
        }}
      />
      <AddCSVSongsDialog
        title="Add Songs (CSV Text)"
        message="Paste CSV rows for new songs below."
        visible={addSongDialogIsOpen}
        setVisible={setAddSongDialogIsOpen}
        onSubmit={(newSongs: SongData[]) => dispatch(addNewSongs(newSongs))}
        existingSongs={songs}
      />
      <ViewOptionsDialog
        visible={viewOptionsDialogIsOpen}
        setVisible={setViewOptionsDialogIsOpen}
        onSubmit={(newOptions: ViewOptions) => {
          dispatch(setViewOptions(newOptions));
        }}
        viewOptions={viewOptions}
      />
      <PopupModal
        visible={testIsOpen}
        setVisible={setTestIsOpen}
        onSubmit={() => console.log('a')}
        title="Test Popup"
      >
        <span>Hello</span>
      </PopupModal>
    </div>
  );
};
export default HeaderCommandBar;
