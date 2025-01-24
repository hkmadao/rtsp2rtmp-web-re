import { ChangeEvent, FC, useEffect, useMemo, useRef } from 'react';
import Flv from 'flv.js';
import React from 'react';
import { Checkbox, message, Spin } from 'antd';
import { nanoid } from '@reduxjs/toolkit';
import BaseAPI from '@/api';
import { getLonginUser, User } from '@/session';
import styles from './style.less';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

type FlvMediaInfo = {
  duration: number;
  hasAudio: boolean;
};

type VodProp = {
  mediaDataGetUrl: string;
  playerId: string;
  fgPlay: boolean;
  fgMuted: boolean;
  volume: number;
  duration: number;
  offsetTime: number;
};

const VodPlay: FC<{
  /**
   * eg. http://127.0.0.1:8080/cameraRecord/getDuration/:camerRecordId
   *     or http://127.0.0.1:8080/cameraRecord/getDuration/:fileName
   */
  mediaInfoGetUrl: string;
  /**
   * eg. http://127.0.0.1:8080/cameraRecord/start/:camerRecordId
   *     or http://127.0.0.1:8080/cameraRecord/start/:fileName
   */
  mediaDataGetUrl: string;
  /**
   * eg. http://127.0.0.1:8080/cameraRecord/fetch
   *     or http://127.0.0.1:8080/cameraRecord/fetch
   */
  playTimeNotifyUrl: string;
}> = ({ mediaInfoGetUrl, mediaDataGetUrl, playTimeNotifyUrl }) => {
  const [hasAudio, setHasAudio] = React.useState(true); // source media hasAudio flag
  const [loading, setLoading] = React.useState(false);
  const [showVideoElement, setShowVideoElement] = React.useState(true);
  const playRef = useRef<Flv.Player>();
  const videoElementRef = useRef<HTMLMediaElement>();
  const modalContentRef = useRef<HTMLDivElement>();
  const lockRef = React.useRef<boolean>(false);

  const [fgMuted, setFgMuted] = React.useState(false);
  const [fgPlay, setFgPlay] = React.useState(false);
  const [fgFullScreen, setFgFullScreen] = React.useState(false);
  const [volume, setVolume] = React.useState(1);
  const [duration, setDuration] = React.useState<number>(0);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [playerId, setPlayerId] = React.useState<string>(nanoid());
  const [offsetTime, setOffsetTime] = React.useState<number>(0);
  const [mouseMoveOnVideo, setMouseMoveOnVideo] = React.useState(false);

  const handleHasAudioChange = (e: CheckboxChangeEvent) => {
    const hasAudio = e.target.checked;
    setHasAudio(hasAudio);
    const fgMuted = !hasAudio;
    setFgMuted(fgMuted);
    setShowVideoElement(false);
    const playerId = nanoid();
    setPlayerId(playerId);
    const fgPlay = false;
    setFgPlay(false);
    const vodProp: VodProp = {
      mediaDataGetUrl: mediaDataGetUrl,
      playerId: playerId,
      fgPlay: fgPlay,
      fgMuted: fgMuted,
      volume: volume,
      duration: duration,
      offsetTime: offsetTime,
    };
    flv_load(vodProp);
  };

  useEffect(() => {
    const videoDurationUrl = mediaInfoGetUrl;
    setLoading(true);
    BaseAPI.GET(videoDurationUrl)
      .then((mediaInfo: FlvMediaInfo) => {
        setDuration(mediaInfo.duration);
        setHasAudio(mediaInfo.hasAudio);
        setFgMuted(!mediaInfo.hasAudio);
        const vodProp: VodProp = {
          mediaDataGetUrl: mediaDataGetUrl,
          playerId: playerId,
          fgPlay: fgPlay,
          fgMuted: !mediaInfo.hasAudio,
          volume: volume,
          duration: duration,
          offsetTime: offsetTime,
        };
        flv_load(vodProp);
      })
      .catch((e) => {
        message.error('get duration error');
      });
    setLoading(false);
  }, []);

  const durationSec = useMemo(() => {
    return Math.floor(duration / 1000);
  }, [duration]);

  const step = useMemo(() => {
    if (durationSec < 100) {
      return 1;
    }
    return Math.floor(durationSec / 100);
  }, [durationSec]);

  const volumeNode = useMemo(() => {
    if (fgMuted) {
      return <img width={'20px'} src="./volumeDisable.svg" />;
    }
    if (volume === 0) {
      return <img width={'20px'} src="./volumeZero.svg" />;
    }
    if (volume >= 0.75) {
      return <img width={'20px'} src="./volumeHigh.svg" />;
    }
    if (volume >= 0.5) {
      return <img width={'20px'} src="./volumeMiddle.svg" />;
    }
    return <img width={'20px'} src="./volumeLow.svg" />;
  }, [fgMuted, volume]);

  const timeDisplay = (durationSec: number) => {
    durationSec = Math.floor(durationSec);
    if (durationSec >= 1 * 60 * 60) {
      const hour = Math.floor(durationSec / (60 * 60));
      const m = Math.floor((durationSec % (60 * 60)) / 60);
      const s = (durationSec % (60 * 60)) % 60;
      return `${hour}:${m}:${s}`;
    } else if (durationSec >= 60) {
      const m = Math.floor((durationSec % (60 * 60)) / 60);
      const s = (durationSec % (60 * 60)) % 60;
      return `${m}:${s}`;
    } else {
      const s = durationSec;
      return `00:${s}`;
    }
  };

  const durationDispaly = useMemo(() => {
    return timeDisplay(durationSec);
  }, [durationSec]);

  const currentTimeDispaly = useMemo(() => {
    return timeDisplay(currentTime + offsetTime);
  }, [currentTime]);

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    console.log(value);

    const buffered = playRef.current?.buffered;
    if (buffered && buffered.length > 0) {
      if (
        value <= buffered.start(0) + offsetTime ||
        value >= buffered.end(0) + offsetTime
      ) {
        if (!lockRef.current) {
          lockRef.current = true;
          const offsetTime = value;
          setOffsetTime(offsetTime);
          const playerId = nanoid();
          setPlayerId(playerId);
          const vodProp: VodProp = {
            mediaDataGetUrl: mediaDataGetUrl,
            playerId: playerId,
            fgPlay: fgPlay,
            fgMuted: fgMuted,
            volume: volume,
            duration: duration,
            offsetTime: offsetTime,
          };
          flv_load(vodProp);
          setTimeout(() => {
            lockRef.current = false;
          }, 500);
        }
      } else {
        if (!lockRef.current) {
          if (playRef.current) {
            playRef.current.currentTime = value - offsetTime;
          }
          const seekSecond = Math.floor(value);
          let videoUrl = `${playTimeNotifyUrl}?playerId=${playerId}&seekSecond=${seekSecond}`;
          BaseAPI.GET(videoUrl);
        }
      }
    }
  };

  const handleFullScreen = () => {
    // if (modalContentRef.current) {
    //   if (!fgFullScreen) {
    //     modalContentRef.current.requestFullscreen();
    //   }
    // }
    setFgFullScreen(!fgFullScreen);
  };

  const handleVolumeClick = () => {
    if (!hasAudio) {
      return;
    }
    if (videoElementRef.current) {
      videoElementRef.current.muted = !videoElementRef.current.muted;
    }
    setFgMuted(!fgMuted);
  };

  const handleVolumeRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!hasAudio) {
      return;
    }
    const volume = parseInt(e.target.value) / 100;
    setVolume(volume);
    if (videoElementRef.current) {
      videoElementRef.current.volume = volume;
    }
  };

  const handleVideoTogglePlay = () => {
    if (videoElementRef.current) {
      if (!playRef.current) {
        const offsetTime = 0;
        setOffsetTime(offsetTime);
        const playerId = nanoid();
        setPlayerId(playerId);
        const vodProp: VodProp = {
          mediaDataGetUrl: mediaDataGetUrl,
          playerId: playerId,
          fgPlay: fgPlay,
          fgMuted: fgMuted,
          volume: volume,
          duration: duration,
          offsetTime: offsetTime,
        };
        flv_load(vodProp);
        return;
      }
      if (videoElementRef.current.paused) {
        videoElementRef.current
          .play()
          ?.then(() => {})
          .catch((e) => {
            console.error('play error:', e);
            message.error('播放出错啦');
            setFgPlay(false);
            playRef.current?.pause();
            playRef.current?.unload();
            playRef.current?.detachMediaElement();
            playRef.current?.destroy();
            playRef.current = undefined;
          });
      } else {
        videoElementRef.current.pause();
      }
    }
  };

  const flv_load = (vodProp: VodProp) => {
    setShowVideoElement(true);
    const seekSecond = Math.floor(vodProp.offsetTime);
    let videoUrl = `${vodProp.mediaDataGetUrl}?playerId=${vodProp.playerId}&seekSecond=${seekSecond}`;
    var mediaDataSource: Flv.MediaDataSource = {
      type: 'flv',
      duration: vodProp.duration,
      url: videoUrl,
      hasAudio: !vodProp.fgMuted,
    };
    console.log('MediaDataSource', mediaDataSource);

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
      setFgPlay(false);
    });

    element.addEventListener('play', (param: any) => {
      setFgPlay(true);
    });

    element.addEventListener('volumechange', function (e) {
      console.log('volume:', element.volume);
      setVolume(element.volume);
    });

    // seeking：查找开始。当用户开始移动/跳跃到音频/视频中新的位置时触发
    element.addEventListener('seeking', function (e: any) {
      // console.log('开始移动进度条');
      // console.log(e);
    });

    playRef.current.attachMediaElement(element);
    playRef.current.load();
    playRef.current.volume = vodProp.volume;
    if (vodProp.fgPlay) {
      playRef.current
        .play()
        ?.then(() => {})
        .catch((e) => {
          console.error('play error:', e);
          message.error('播放出错啦');
          setFgPlay(false);
          playRef.current?.pause();
          playRef.current?.unload();
          playRef.current?.detachMediaElement();
          playRef.current?.destroy();
          playRef.current = undefined;
        });
    }
  };

  return (
    <>
      <Spin spinning={loading} delay={100}>
        <div
          ref={modalContentRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '30px',
          }}
        >
          <div>
            <Checkbox checked={hasAudio} onChange={handleHasAudioChange}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span>hasAudio</span>
                <span>若播放错误，可尝试取消此选项</span>
              </div>
            </Checkbox>
          </div>
          <div>
            <div
              onMouseMove={() => {
                setMouseMoveOnVideo(true);
              }}
              onMouseLeave={() => {
                setMouseMoveOnVideo(false);
              }}
            >
              <video
                style={{ display: showVideoElement ? undefined : 'none' }}
                ref={videoElementRef}
                className="centeredVideo"
                controlsList=""
                width={'100%'}
                poster={'./video-background.png'}
                onClick={handleVideoTogglePlay}
              >
                Your browser is too old which doesn't support HTML5 video.
              </video>
            </div>
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flex: 'auto',
                top: '45%',
                left: '45%',
                color: 'white',
                padding: '0px 5px',
              }}
            >
              <div onClick={handleVideoTogglePlay}>
                {fgPlay ? (
                  <div>{/* <img width={'26px'} src="./pause.svg" /> */}</div>
                ) : (
                  <div>
                    <img width={'50px'} src="./play.svg" />
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flex: 'auto',
                width: '100%',
                bottom: '5px',
                color: 'white',
                padding: '0px 5px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 'auto',
                  gap: '5px',
                }}
                className={styles['timelime-content']}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    style={{ width: '100%', height: '2px' }}
                    className={styles['range-input']}
                    type="range"
                    min={0}
                    max={durationSec}
                    value={Math.floor(currentTime + offsetTime)}
                    onChange={handleRangeChange}
                    step={step}
                    // onPointerEnter={(e) => console.log(e)}
                  />
                </div>
                <div
                  style={{
                    height: !mouseMoveOnVideo && fgPlay ? undefined : '30px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    <div onClick={handleVideoTogglePlay}>
                      {fgPlay ? (
                        <div>
                          <img width={'26px'} src="./pause.svg" />
                        </div>
                      ) : (
                        <div>
                          <img width={'26px'} src="./play.svg" />
                        </div>
                      )}
                    </div>
                    <div style={{ alignItems: 'center' }}>
                      {currentTimeDispaly}
                      {' / '}
                      {durationDispaly}
                    </div>
                    <div className={styles['volume-range']}>
                      <div onClick={handleVolumeClick}>{volumeNode}</div>
                      <div>
                        <input
                          className={styles['range-input']}
                          type="range"
                          min={0}
                          max={100}
                          value={Math.floor(volume * 100)}
                          onChange={handleVolumeRangeChange}
                          step={1}
                          onPointerEnter={(e) => console.log(e)}
                        />
                      </div>
                    </div>
                  </div>
                  <div hidden={true} onClick={handleFullScreen}>
                    {fgFullScreen ? '退出全屏' : '进入全屏'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};
export default VodPlay;
