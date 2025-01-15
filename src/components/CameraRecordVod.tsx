import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import Flv from 'flv.js';
import React from 'react';
import { Button, Checkbox, message, Modal, Spin } from 'antd';
import Env from '@/conf/env';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { nanoid } from '@reduxjs/toolkit';
import BaseAPI from '@/api';
import { getLonginUser, User } from '@/session';

export type TVodInfo = {
  idCameraRecord: string;
};

const CameraRecordVod: FC<{
  disabled: boolean;
  getVodInfo: () => TVodInfo | undefined;
}> = ({ disabled, getVodInfo }) => {
  const [loading, setLoading] = React.useState(false);
  const [audio, setAudio] = React.useState(true);
  const [duration, setDuration] = React.useState<number>(0);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [preCurrentTime, setPreCurrentTime] = React.useState<number>(0);
  const [displayVideoElement, setDisplayVideoElement] = React.useState(true);
  const [playerId, setPlayerId] = React.useState<string>(nanoid());
  const vodInfoRef = React.useRef<TVodInfo>();
  const lockRef = React.useRef<boolean>(false);
  const lastUpdateTimeRef = React.useRef<Date>(new Date());
  const [offsetTime, setOffsetTime] = React.useState<number>(0);
  const [open, setOpen] = React.useState(false);
  const playRef = useRef<Flv.Player>();

  useEffect(() => {
    const vodInfo = getVodInfo();
    vodInfoRef.current = vodInfo;
  }, []);

  const step = useMemo(() => {
    if (duration < 100) {
      return 1;
    }
    return Math.floor(duration / 100);
  }, [duration]);

  const timeDisplay = (duration: number) => {
    const dura = Math.floor(duration);
    if (dura >= 1 * 60 * 60) {
      const hour = Math.floor(dura / (60 * 60));
      const m = Math.floor((dura % (60 * 60)) / 60);
      const s = (dura % (60 * 60)) % 60;
      return `${hour}:${m}:${s}`;
    } else if (dura >= 60) {
      const m = Math.floor((dura % (60 * 60)) / 60);
      const s = (dura % (60 * 60)) % 60;
      return `${m}:${s}`;
    } else {
      const s = dura;
      return `00:${s}`;
    }
  };

  const durationDispaly = useMemo(() => {
    return timeDisplay(duration);
  }, [duration]);

  const currentTimeDispaly = useMemo(() => {
    return timeDisplay(currentTime + offsetTime);
  }, [currentTime]);

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    setPreCurrentTime(value);
    // const timeGap = new Date().getTime() - lastUpdateTimeRef.current.getTime();
    // lastUpdateTimeRef.current = new Date();
    // if (timeGap < 100) {
    //   return;
    // }

    const gap = value - currentTime - offsetTime;
    if (gap > 3 * 60 || gap < 0) {
      if (!lockRef.current) {
        lockRef.current = true;
        setOffsetTime(value);
        const playerId = nanoid();
        setPlayerId(playerId);
        flv_load(playerId, value);
        setTimeout(() => {
          lockRef.current = false;
        }, 500);
      }
    } else if (gap >= 2) {
      if (!lockRef.current) {
        if (playRef.current) {
          playRef.current.currentTime = value - offsetTime;
        }
        const seekSecond = Math.floor(value);
        let videoUrl = `/cameraRecord/fetch?playerId=${playerId}&seekSecond=${seekSecond}`;
        BaseAPI.GET(videoUrl);
      }
    }
  };

  const handleToPlay = async () => {
    setOpen(true);
    const vodInfo = getVodInfo();
    vodInfoRef.current = vodInfo;
    const videoDurationUrl = `/cameraRecord/getDuration?idCameraRecord=${vodInfo?.idCameraRecord}`;
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
    setOffsetTime(0);
    setPlayerId(playerId);
    flv_load(playerId, 0);
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

  const flv_load = (playerId: string, offsetTime: number) => {
    const vodInfo = getVodInfo();
    if (!vodInfo) {
      message.error('getVodInfo error');
      return;
    }
    setDisplayVideoElement(true);
    const idCameraRecord = vodInfo.idCameraRecord;
    const seekSecond = Math.floor(offsetTime);
    let videoUrl = `${Env.directServerUrl}/cameraRecord/start?idCameraRecord=${idCameraRecord}&playerId=${playerId}&seekSecond=${seekSecond}`;
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

    playRef.current.on(
      Flv.Events.ERROR,
      (errorType: any, errorDetail: any, errorInfo: any) => {
        console.log('errorType:', errorType);
        console.log('errorDetail:', errorDetail);
        console.log('errorInfo:', errorInfo);
      },
    );
    element.addEventListener('timeupdate', (param: any) => {
      setCurrentTime(element.currentTime);
    });

    element.addEventListener('pause', (param: any) => {
      console.log('pause:', element.paused);
    });

    // seeking：查找开始。当用户开始移动/跳跃到音频/视频中新的位置时触发
    element.addEventListener('seeking', function (e: any) {
      // console.log('开始移动进度条');
      // console.log(e);
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
        width={window.innerWidth * 0.8}
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
              {/* <div>{timeDisplay(offsetTime)}</div> */}
            </div>
            <div>
              {displayVideoElement ? (
                <video className="centeredVideo" controlsList="" width={'100%'} poster={'./video-background.png'}>
                  Your browser is too old which doesn't support HTML5 video.
                </video>
              ) : undefined}
              <div style={{ display: 'flex', gap: '20px' }}>
                <div>{currentTimeDispaly}</div>
                <input
                  style={{ width: '100%' }}
                  type="range"
                  min={0}
                  max={duration}
                  value={Math.floor(currentTime + offsetTime)}
                  onChange={handleRangeChange}
                  step={step}
                  onDragOver={(e) => {
                    console.log(e);
                  }}
                />
                <div>{durationDispaly}</div>
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
};
export default CameraRecordVod;
