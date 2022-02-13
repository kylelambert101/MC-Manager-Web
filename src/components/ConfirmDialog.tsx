/* eslint-disable react/require-default-props */
import * as React from 'react';
import {
  DefaultButton,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  Stack,
} from 'office-ui-fabric-react';

interface Props {
  /**
   * Whether or not this dialog is visible
   */
  visible: boolean;

  /**
   * Update function to set the visibility of this dialog
   */
  setVisible: (visible: boolean) => void;

  /**
   * Message to display to the user for confirmation
   */
  message: string;

  /**
   * Function to call when the user clicks the confirm button
   */
  onConfirm: () => void;

  /**
   * Optional title for the dialog window
   */
  title?: string;

  /**
   * Optional function to call when the user clicks the cancel button
   */
  onCancel?: () => void;

  /**
   * Optional text for the confirm button
   */
  confirmAltText?: string;

  /**
   * Optional text for the cancel button
   */
  cancelAltText?: string;
}

/**
 * ConfirmDialog presents a generic confirmation dialog, using a passed-in message and
 * a callback function to run if the user confirms.
 * By default, the dialog presents the user "Confirm" and "Cancel" options, but these can
 * be overridden by the optional props.
 */
const ConfirmDialog = (props: Props): React.ReactElement => {
  const {
    visible,
    setVisible,
    message,
    title,
    onConfirm,
    onCancel,
    confirmAltText,
    cancelAltText,
  } = props;

  const dialogContentProps = {
    type: DialogType.normal,
    title: title || 'Please Confirm',
    closeButtonAriaLabel: 'Close',
    subText: message,
  };

  // Callback for the Confirm button - close the dialog and call the onConfirm callback
  const handleConfirm = (): void => {
    setVisible(false);
    onConfirm();
  };

  // Callback for the Cancel button - close the dialog and call onCancel if it exists
  const handleCancel = (): void => {
    setVisible(false);
    if (typeof onCancel !== 'undefined') {
      onCancel();
    }
  };

  return (
    <Dialog
      hidden={!visible}
      dialogContentProps={dialogContentProps}
      onDismiss={() => setVisible(false)}
    >
      <DialogFooter>
        <Stack
          horizontal
          horizontalAlign="center"
          tokens={{ childrenGap: '10px' }}
        >
          <PrimaryButton
            onClick={handleConfirm}
            text={confirmAltText || 'Confirm'}
          />
          <DefaultButton
            onClick={handleCancel}
            text={cancelAltText || 'Cancel'}
          />
        </Stack>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDialog;
