import { FC, useEffect, useMemo } from 'react';
import React from 'react';
import { Button, Modal } from 'antd';
import Vod from './Vod';

const CameraRecordVod: FC<{
  disabled: boolean;
  idCameraRecord: string;
}> = ({ disabled, idCameraRecord }) => {
  const [open, setOpen] = React.useState(false);

  const recordId = useMemo(() => idCameraRecord, [idCameraRecord]);

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
        <Vod idCameraRecord={recordId} />
      </Modal>
    </>
  );
};
export default CameraRecordVod;
