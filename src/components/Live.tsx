import { FC, useRef } from 'react';
import Flv from 'flv.js';
import React from 'react';
import { Button, Checkbox, message, Modal } from 'antd';
import Env from '@/conf/env';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

export type TLiveInfo = {
  method: 'permanent' | 'temp';
  code: string;
  playAuthCode: string;
};

const Live: FC<{
  disabled: boolean;
  getLiveInfo: () => TLiveInfo | undefined;
}> = ({ disabled, getLiveInfo }) => {
  const [audio, setAudio] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const playRef = useRef<any>();

  const handleToPlay = () => {
    setOpen(true);
  };

  const handlePlay = () => {
    flv_load();
  };

  const handlePlayClose = () => {
    setOpen(false);
  };

  const handleAudioChange = (e: CheckboxChangeEvent) => {
    setAudio(e.target.checked);
  };

  const flv_load = () => {
    const liveInfo = getLiveInfo();
    const serverURL = Env.serverURL;
    if (!liveInfo) {
      message.error('getLiveInfo error');
      return;
    }
    if (!liveInfo.method || !liveInfo.code || !liveInfo.playAuthCode) {
      return;
    }
    var mediaDataSource: any = {
      type: 'flv',
    };
    let videoUrl = `${serverURL}/live/${liveInfo.method}/${liveInfo.code}/${liveInfo.playAuthCode}.flv`;
    mediaDataSource['url'] = videoUrl;
    mediaDataSource['hasAudio'] = audio;
    mediaDataSource['isLive'] = true;
    console.log('MediaDataSource', mediaDataSource);
    flv_load_mds(mediaDataSource);
  };

  const flv_load_mds = (mediaDataSource: any) => {
    var element = document.getElementsByClassName('centeredVideo')[0];

    if (playRef.current) {
      playRef.current.pause();
      playRef.current.unload();
      playRef.current.detachMediaElement();
      playRef.current.destroy();
      playRef.current = undefined;
    }

    playRef.current = Flv.createPlayer(mediaDataSource, {
      enableWorker: false,
      lazyLoadMaxDuration: 3 * 60,
      seekType: 'range',
    });
    playRef.current.on(
      Flv.Events.ERROR,
      (errorType: any, errorDetail: any, errorInfo: any) => {
        console.log('errorType:', errorType);
        console.log('errorDetail:', errorDetail);
        console.log('errorInfo:', errorInfo);
      },
    );
    playRef.current.attachMediaElement(element);
    playRef.current.load();
    playRef.current.play();
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Button type="primary" onClick={handlePlay}>
              Play
            </Button>
            <Checkbox checked={audio} onChange={handleAudioChange}>
              hasAudio
            </Checkbox>
          </div>
          <div>
            <video className="centeredVideo" controls width="100%">
              Your browser is too old which doesn't support HTML5 video.
            </video>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Live;
