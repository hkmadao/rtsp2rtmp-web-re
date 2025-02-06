import { FC } from 'react';
import { Button, Modal } from 'antd';
import LiveCore, { TLiveInfo } from './LiveCore';
import React from 'react';

const Live: FC<{
  disabled: boolean;
  getLiveInfo: () => TLiveInfo | undefined;
}> = ({ disabled, getLiveInfo }) => {
  const [open, setOpen] = React.useState(false);

  const handleToPlay = () => {
    setOpen(true);
  };

  const handlePlayClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        size={'middle'}
        type={'primary'}
        disabled={disabled}
        onClick={handleToPlay}
      >
        播放
      </Button>
      <Modal
        open={open}
        maskClosable={false}
        onCancel={handlePlayClose}
        destroyOnClose={true}
        width={window.innerWidth * 0.9}
        footer={''}
      >
        <LiveCore getLiveInfo={getLiveInfo} />
      </Modal>
    </>
  );
};
export default Live;
