/* eslint-disable react/require-default-props */
import {
  Checkbox,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IDialogContentProps,
  Label,
  Pivot,
  PivotItem,
  PrimaryButton,
  Stack,
} from 'office-ui-fabric-react';
import * as React from 'react';
import { expectedCSVColumnOrder } from '../../../utils/CSVUtilities';
import { SongDataColumn, ViewOptions } from '../MusicTypes';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSubmit: (newViewOptions: ViewOptions) => void;
  onCancel?: () => void;
  viewOptions: ViewOptions;
}

const ViewOptionsDialog = (props: Props): React.ReactElement => {
  const { visible, setVisible, onSubmit, onCancel, viewOptions } = props;
  const [pendingViewOptions, setPendingViewOptions] = React.useState(
    viewOptions
  );
  const dialogContentProps: IDialogContentProps = {
    type: DialogType.normal,
    title: 'View Options',
    closeButtonAriaLabel: 'Close',
    // subText: 'Configure options for viewing music collection data',
  };

  const handleSubmit = () => {
    setVisible(false);
    onSubmit(pendingViewOptions);
  };

  const handleCancel = () => {
    setVisible(false);
    setPendingViewOptions(viewOptions);

    if (typeof onCancel !== 'undefined') {
      onCancel();
    }
  };

  const handleFadeInactiveChange = (
    ev?: React.FormEvent<HTMLElement>,
    isChecked?: boolean
  ) => {
    setPendingViewOptions({
      ...pendingViewOptions,
      fadeInactive: !pendingViewOptions.fadeInactive,
    });
  };

  const handleColumnCheckboxChange = (column: SongDataColumn) => {
    const { hiddenColumns } = pendingViewOptions;
    const columnIsHidden = hiddenColumns.some((c) => c.name === column.name);
    if (columnIsHidden) {
      setPendingViewOptions({
        ...pendingViewOptions,
        // Remove the new column from the hidden list
        hiddenColumns: hiddenColumns.filter((c) => c.name !== column.name),
      });
    } else {
      setPendingViewOptions({
        ...pendingViewOptions,
        hiddenColumns: [...hiddenColumns, column],
      });
    }
  };

  const pivotItemStyle = { marginTop: '1em' };

  return (
    <Dialog
      hidden={!visible}
      dialogContentProps={dialogContentProps}
      onDismiss={handleCancel}
      minWidth="80%"
      maxWidth="80%"
    >
      <Pivot aria-label="View Options Pivot">
        <PivotItem headerText="General">
          <Stack tokens={{ childrenGap: '1em' }} style={pivotItemStyle}>
            <Checkbox
              label="Fade Inactive Song Rows"
              checked={pendingViewOptions.fadeInactive}
              onChange={handleFadeInactiveChange}
              style={{ marginTop: 10 }}
            />
          </Stack>
        </PivotItem>
        <PivotItem headerText="Show/Hide Columns">
          <Label htmlFor="showHideColumnStack">Visible Columns:</Label>
          <Stack
            key="showHideColumnStack"
            tokens={{ childrenGap: '1em' }}
            style={pivotItemStyle}
          >
            {expectedCSVColumnOrder.map((col) => (
              <Checkbox
                key={col.name}
                label={col.csvHeaderName}
                checked={
                  !pendingViewOptions.hiddenColumns.some(
                    (c) => c.name === col.name
                  )
                }
                onChange={() => handleColumnCheckboxChange(col)}
              />
            ))}
          </Stack>
        </PivotItem>
      </Pivot>
      <DialogFooter>
        <Stack
          horizontal
          horizontalAlign="center"
          tokens={{ childrenGap: '10px' }}
        >
          <PrimaryButton onClick={handleSubmit} text="Submit" />
          <DefaultButton onClick={handleCancel} text="Cancel" />
        </Stack>
      </DialogFooter>
    </Dialog>
  );
};

export default ViewOptionsDialog;
