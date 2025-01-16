import { FC, useEffect, useMemo } from 'react';
import React from 'react';
import { Button, Modal } from 'antd';
import Vod from './Vod';

const VodPlay: FC<{
  disabled: boolean;
  fileName: string;
}> = ({ disabled, fileName }) => {
  const [open, setOpen] = React.useState(false);

  const flvFileName = useMemo(() => fileName, [fileName]);

  useEffect(() => {}, []);

  const handleToPlay = async () => {
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
        观看录像
      </Button>
      <Modal
        open={open}
        maskClosable={false}
        onCancel={handlePlayClose}
        destroyOnClose={true}
        width={window.innerWidth * 0.8}
        footer={''}
      >
        <Vod flvFileName={flvFileName} />
      </Modal>
    </>
  );
};
export default VodPlay;
