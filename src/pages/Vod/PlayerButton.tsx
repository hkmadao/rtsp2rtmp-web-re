import { FC, useEffect, useRef } from 'react';
import Flv from 'flv.js';
import React from 'react';
import { Button, Checkbox, message, Modal, Spin } from 'antd';
import Env from '@/conf/env';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { nanoid } from '@reduxjs/toolkit';
import BaseAPI from '@/api';
import { getLonginUser, User } from '@/session';

export type TVodInfo = {
  fileName: string;
};

const PlayerButton: FC<{
  disabled: boolean;
  getVodInfo: () => TVodInfo | undefined;
}> = ({ disabled, getVodInfo }) => {
  const [audio, setAudio] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [duration, setDuration] = React.useState<number>(0);
  const [displayVideoElement, setDisplayVideoElement] = React.useState(true);
  const playerIdRef = React.useRef<string>('');
  const lastPlayTimeRef = React.useRef<number>(0);
  const timeUpdateGapRef = React.useRef<number>(0);
  const complateRef = React.useRef<boolean>(false);
  const vodInfoRef = React.useRef<TVodInfo>();
  const [offsetTime, setOffsetTime] = React.useState<number>(0);
  const [open, setOpen] = React.useState(false);
  const playRef = useRef<Flv.Player>();

  useEffect(() => {}, []);

  const handleToPlay = async () => {
    setOpen(true);
    const vodInfo = getVodInfo();
    vodInfoRef.current = vodInfo;
    const videoDurationUrl = `/vod/getDuration/${vodInfo?.fileName}`;
    try {
      setLoading(true);
      const duration = await BaseAPI.GET(videoDurationUrl);
      setDuration(Math.floor(duration / 1000));
    } catch (e: any) {
      message.error('get duration error');
    }
    setLoading(false);
  };

  const handlePlay = () => {
    let playerId = nanoid();
    lastPlayTimeRef.current = 0;
    complateRef.current = false;
    timeUpdateGapRef.current = 0;
    setOffsetTime(0);
    playerIdRef.current = playerId;
    flv_load();
  };

  const handlePlayClose = () => {
    if (playRef.current) {
      playRef.current.pause();
      playRef.current.unload();
      playRef.current.detachMediaElement();
      playRef.current.destroy();
      playRef.current = undefined;
    }
    setOpen(false);
  };

  const handleAudioChange = (e: CheckboxChangeEvent) => {
    setAudio(e.target.checked);
  };

  const flv_load = async () => {
    if (!vodInfoRef.current) {
      message.error('getVodInfo error');
      return;
    }
    setDisplayVideoElement(true);
    const playerId = playerIdRef.current;
    const fileName = vodInfoRef.current.fileName;

    const seekSecond = Math.floor(lastPlayTimeRef.current);
    let videoUrl = `${Env.directServerUrl}/vod/start/${fileName}?playerId=${playerId}&seekSecond=${seekSecond}`;
    setOffsetTime(seekSecond);
    var mediaDataSource: Flv.MediaDataSource = {
      type: 'flv',
      duration: duration,
      url: videoUrl,
      hasAudio: audio,
    };
    console.log('MediaDataSource', mediaDataSource);
    flv_load_mds(mediaDataSource);
  };

  const flv_load_mds = (mediaDataSource: Flv.MediaDataSource) => {
    var element = document.getElementsByClassName(
      'centeredVideo',
    )[0] as HTMLMediaElement;

    if (playRef.current) {
      playRef.current.pause();
      playRef.current.unload();
      playRef.current.detachMediaElement();
      playRef.current.destroy();
      playRef.current = undefined;
    }

    const user: User = getLonginUser();
    if (!user || !user.token) {
      message.error('get token error');
      return;
    }
    const authorization = user.token;
    playRef.current = Flv.createPlayer(mediaDataSource, {
      isLive: false,
      enableWorker: false,
      lazyLoad: true,
      lazyLoadMaxDuration: 5 * 60 * 60,
      lazyLoadRecoverDuration: 5 * 60 * 60,
      headers: {
        Authorization: authorization,
      },
    });

    complateRef.current = false;
    playRef.current.on(
      Flv.Events.ERROR,
      (errorType: any, errorDetail: any, errorInfo: any) => {
        console.log('errorType:', errorType);
        console.log('errorDetail:', errorDetail);
        console.log('errorInfo:', errorInfo);
      },
    );
    element.addEventListener('timeupdate', (param: any) => {
      timeUpdateGapRef.current = element.currentTime - lastPlayTimeRef.current;
      if (timeUpdateGapRef.current > 3 * 60 && !complateRef.current) {
        lastPlayTimeRef.current = element.currentTime;
        setDisplayVideoElement(false);
        complateRef.current = true;
        if (playRef.current) {
          playRef.current.pause();
          playRef.current.unload();
          playRef.current.detachMediaElement();
          playRef.current.destroy();
          playRef.current = undefined;
        }
        playRef.current = undefined;
        playerIdRef.current = nanoid();
        flv_load();
      } else if (timeUpdateGapRef.current >= 2 && !complateRef.current) {
        const seekSecond = Math.floor(element.currentTime);
        let videoUrl = `/vod/fetch/${vodInfoRef.current?.fileName}?playerId=${playerIdRef.current}&seekSecond=${seekSecond}`;
        BaseAPI.GET(videoUrl);
      }
      if (!complateRef.current) {
        lastPlayTimeRef.current = element.currentTime;
      }
    });

    // seeking：查找开始。当用户开始移动/跳跃到音频/视频中新的位置时触发
    element.addEventListener('seeking', function (e: any) {
      console.log('开始移动进度条');
      console.log(e);
    });

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
        观看录像
      </Button>
      <Modal
        open={open}
        maskClosable={false}
        onCancel={handlePlayClose}
        destroyOnClose={true}
        width={window.innerWidth * 0.9}
        footer={''}
      >
        <Spin spinning={loading} delay={100}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <div style={{ display: 'flex', gap: '20px' }}>
              <Button type="primary" onClick={handlePlay}>
                Play
              </Button>
              <Checkbox checked={audio} onChange={handleAudioChange}>
                hasAudio
              </Checkbox>
              {/* <div>{offsetTime}</div> */}
            </div>
            <div>
              {displayVideoElement ? (
                <video
                  className="centeredVideo"
                  width="100%"
                  poster={'./video-background.png'}
                >
                  Your browser is too old which doesn't support HTML5 video.
                </video>
              ) : undefined}
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
};
export default PlayerButton;
