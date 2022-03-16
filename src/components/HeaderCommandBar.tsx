import * as React from "react";
import { CommandBar, ICommandBarItemProps, IButtonProps } from "@fluentui/react";
import { useToasts } from "react-toast-notifications";
import ConfirmDialog from "./ConfirmDialog";
import { saveCSVFile } from "../utils/FileUtilities";
import AddCSVSongsDialog from "./dialogs/AddCSVSongsDialog";
import { SongData, ViewOptions } from "../constants/MusicTypes";
import songDataFields from "../constants/songDataFields.json";
import ViewOptionsDialog from "./dialogs/ViewOptionsDialog";
import PopupModal from "./dialogs/PopupModal";
import { useMusicData } from "../hooks/useMusicData";
import { useSongDataContext } from "../contexts/SongDataContext";

const overflowProps: IButtonProps = { ariaLabel: "More commands" };

const HeaderCommandBar = (): React.ReactElement => {
  const {
    // songs,
    saveFilePath,
    sortColumns,
    viewOptions,
    cachedSongs,
    toggleAndApplySortColumn,
    overwriteCachedSongs,
    resetSorting,
    resetSongsFromCached,
    addNewSongs,
    setViewOptions,
  } = useMusicData();
  const { songs, isLoading, triggerFileLoad } = useSongDataContext();

  React.useEffect(() => {
    console.table(songs);
  }, [songs]);
  React.useEffect(() => {
    console.log({ isLoading });
  }, [isLoading]);

  const { addToast } = useToasts();

  // Local state for tracking dialog state
  const [cancelDialogIsOpen, setCancelDialogIsOpen] = React.useState(false);
  const [addSongDialogIsOpen, setAddSongDialogIsOpen] = React.useState(false);
  const [viewOptionsDialogIsOpen, setViewOptionsDialogIsOpen] = React.useState(false);
  const [testIsOpen, setTestIsOpen] = React.useState(false);

  const dataHasChanged = React.useMemo(
    () => JSON.stringify(songs) !== JSON.stringify(cachedSongs),
    [songs, cachedSongs]
  );

  const fileIsOpen = React.useMemo(() => saveFilePath !== "", [saveFilePath]);

  const items: ICommandBarItemProps[] = [
    {
      key: "upload",
      text: "Open CSV",
      iconProps: { iconName: "Database" },
      onClick: triggerFileLoad,
    },

    {
      key: "save",
      text: "Save CSV",
      iconProps: { iconName: "PromotedDatabase" },
      onClick: () => {
        saveCSVFile(saveFilePath, songs);
        overwriteCachedSongs();
        addToast(`Successfully saved changes to ${saveFilePath}`, {
          appearance: "success",
        });
      },
      disabled: !dataHasChanged,
    },
    {
      key: "newItem",
      text: "Add Songs",
      cacheKey: "myCacheKey", // changing this key will invalidate this item's cache
      iconProps: { iconName: "Add" }, // MusicNote is another good option
      onClick: () => {
        setAddSongDialogIsOpen(true);
      },
      disabled: !fileIsOpen,
    },
    {
      key: "sort",
      text: "Sort",
      iconProps: { iconName: "SortLines" },
      onClick: (): boolean => false,
      subMenuProps: {
        items: [
          {
            key: "newestFirst",
            name: "Newest First",
            text: "Newest First",
            // This needs an ariaLabel since it's icon-only
            ariaLabel: "Newest First View",
            iconProps: { iconName: "SortLines" },
            onClick: () => {
              resetSorting();
              toggleAndApplySortColumn(songDataFields.NEW_FILE_NAME.name);
              toggleAndApplySortColumn(songDataFields.DATE.name);
              // Toggle twice so that it switches to descending
              toggleAndApplySortColumn(songDataFields.DATE.name);
            },
          },
          {
            key: "clearSort",
            name: "Clear Sort",
            text: "Clear Sort Rules",
            // This needs an ariaLabel since it's icon-only
            ariaLabel: "Clear Sort Rules",
            iconProps: { iconName: "RemoveFilter" },
            onClick: () => {
              resetSorting();
            },
            disabled: sortColumns.length === 0,
          },
        ],
      },
    },
    {
      key: "view",
      text: "View Options",
      iconProps: { iconName: "View" },
      onClick: () => {
        setViewOptionsDialogIsOpen(true);
      },
    },
    {
      key: "cancel",
      text: "Cancel Changes",
      iconProps: { iconName: "Cancel" },
      onClick: () => {
        setCancelDialogIsOpen(true);
      },
      disabled: !dataHasChanged,
    },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: "tile",
      text: "Grid view",
      // This needs an ariaLabel since it's icon-only
      ariaLabel: "Grid view",
      iconOnly: true,
      iconProps: { iconName: "Tiles" },
      onClick: () => setTestIsOpen(true),
    },
    {
      key: "info",
      text: "Info",
      // This needs an ariaLabel since it's icon-only
      ariaLabel: "Info",
      iconOnly: true,
      iconProps: { iconName: "Info" },
      onClick: () => console.log("Info"),
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
          resetSongsFromCached();
          resetSorting();
          addToast("Changes discarded", { appearance: "info" });
        }}
      />
      <AddCSVSongsDialog
        title="Add Songs (CSV Text)"
        message="Paste CSV rows for new songs below."
        visible={addSongDialogIsOpen}
        setVisible={setAddSongDialogIsOpen}
        onSubmit={(newSongs: SongData[]) => addNewSongs(newSongs)}
        existingSongs={songs}
      />
      <ViewOptionsDialog
        visible={viewOptionsDialogIsOpen}
        setVisible={setViewOptionsDialogIsOpen}
        onSubmit={(newOptions: ViewOptions) => {
          setViewOptions(newOptions);
        }}
        viewOptions={viewOptions}
      />
      <PopupModal
        visible={testIsOpen}
        setVisible={setTestIsOpen}
        onSubmit={() => console.log("a")}
        title="Test Popup"
      >
        <span>Hello</span>
      </PopupModal>
    </div>
  );
};
export default HeaderCommandBar;
