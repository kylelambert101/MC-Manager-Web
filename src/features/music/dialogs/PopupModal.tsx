/* eslint-disable react/require-default-props */
import {
  DefaultButton,
  FontWeights,
  getTheme,
  mergeStyleSets,
  Modal,
  PrimaryButton,
  Stack,
} from 'office-ui-fabric-react';
import * as React from 'react';

const theme = getTheme();
const contentStyles = mergeStyleSets({
  header: [
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      // borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
});

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
}

const PopupModal = (props: Props): React.ReactElement => {
  const {
    visible,
    setVisible,
    onSubmit,
    onCancel,
    title,
    subTitle,
    children,
  } = props;

  const handleSubmit = () => {
    setVisible(false);
    onSubmit();
  };

  const handleCancel = () => {
    setVisible(false);
    // Reset local state if necessary

    if (typeof onCancel !== 'undefined') {
      onCancel();
    }
  };

  return (
    <Modal isOpen={visible} onDismiss={handleCancel} isBlocking={false}>
      <div className={contentStyles.header}>
        <span>{title}</span>
      </div>
      <Stack grow verticalAlign="space-between">
        {children}
        <Stack
          horizontal
          horizontalAlign="center"
          tokens={{ childrenGap: '10px' }}
        >
          <PrimaryButton onClick={handleSubmit} text="Submit" />
          <DefaultButton onClick={handleCancel} text="Cancel" />
        </Stack>
      </Stack>
    </Modal>
  );
};

export default PopupModal;
