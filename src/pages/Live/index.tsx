import { FC, useRef } from 'react';
import Flv from 'flv.js';
import React from 'react';
import { Button, Checkbox, message, Modal } from 'antd';
import Env from '@/conf/env';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import styles from './index.less';

const getQueryString = (name: string) => {
  let reg = new RegExp('(^|&|\\?)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.hash.substring(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
};

export type TLiveInfo = {
  method: 'permanent' | 'temp';
  code: string;
  playAuthCode: string;
};

const Live: FC = () => {
  const [audio, setAudio] = React.useState(true);
  const playRef = useRef<any>();

  const handlePlay = () => {
    flv_load();
  };

  const handleAudioChange = (e: CheckboxChangeEvent) => {
    setAudio(e.target.checked);
  };

  const flv_load = () => {
    let method = getQueryString('method');
    let code = getQueryString('code');
    let authCode = getQueryString('authCode');
    if (!code || !authCode) {
      return;
    }
    if (method !== 'permanent' && method !== 'temp') {
      return;
    }
    const liveInfo: TLiveInfo = {
      method: method,
      code: code,
      playAuthCode: authCode,
    };
    const serverURL = Env.directServerUrl;
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
      <Modal
        open={true}
        maskClosable={false}
        closable={false}
        width={window.innerWidth}
        footer={''}
        className={styles['ant-modal']}
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
            <video
              className="centeredVideo"
              controls
              width="90%"
              poster={'./video-background.png'}
            >
              Your browser is too old which doesn't support HTML5 video.
            </video>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Live;
