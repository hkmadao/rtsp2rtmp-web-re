import { FC, useEffect, useMemo } from 'react';
import React from 'react';
import { Button, Modal } from 'antd';
import VodPlay from '@/components/VodPlay';
import Env from '@/conf/env';

const Vod: FC<{
  disabled: boolean;
  fileName: string;
}> = ({ disabled, fileName }) => {
  const [open, setOpen] = React.useState(false);

  const mediaUrlInfo = useMemo(() => {
    const mediaInfoGetUrl = `/vod/getMediaInfo/${fileName}`;
    const mediaDataGetUrl = `${Env.directServerUrl}/vod/start/${fileName}`;
    const playTimeNotifyUrl = `/vod/fetch`;
    return { mediaInfoGetUrl, mediaDataGetUrl, playTimeNotifyUrl };
  }, [fileName]);

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
        <VodPlay {...mediaUrlInfo} />
      </Modal>
    </>
  );
};
export default Vod;
