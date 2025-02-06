import { FC, useEffect, useRef, useState } from 'react';
import Flv from 'flv.js';
import { Button, Checkbox, message } from 'antd';
import Env from '@/conf/env';
import BaseAPI from '@/api';

type FlvMediaInfo = {
  hasAudio: boolean;
  onlineStatus: boolean;
  anchorName: string;
};

export type TLiveInfo = {
  method: 'permanent' | 'temp';
  code: string;
  playAuthCode: string;
};

const LiveCore: FC<{
  getLiveInfo: () => TLiveInfo | undefined;
}> = ({ getLiveInfo }) => {
  const [canStop, setCanStop] = useState<boolean>(false);
  const playRef = useRef<Flv.Player>();
  const videoElementRef = useRef<HTMLMediaElement>();
  const [flvMediaInfo, setFlvMediaInfo] = useState<FlvMediaInfo>({
    hasAudio: false,
    onlineStatus: false,
    anchorName: '--',
  });
  const fgOnlineStatusRef = useRef<boolean>(flvMediaInfo.onlineStatus);

  useEffect(() => {
    fgOnlineStatusRef.current = flvMediaInfo.onlineStatus;
  }, [flvMediaInfo]);

  useEffect(() => {
    return () => {
      if (playRef.current) {
        playRef.current.pause();
        playRef.current.unload();
        playRef.current.detachMediaElement();
        playRef.current.destroy();
        playRef.current = undefined;
      }
    };
  }, []);

  const handlePlay = () => {
    if (!playRef.current) {
      const liveInfo = getLiveInfo();
      if (!liveInfo) {
        return;
      }
      const mediaInfoGetUrl = `/live/getMediaInfo/${liveInfo.method}/${liveInfo.code}/${liveInfo.playAuthCode}.flv`;
      BaseAPI.GET(mediaInfoGetUrl).then((mediaInfo: FlvMediaInfo) => {
        setFlvMediaInfo(mediaInfo);
        if (!mediaInfo.onlineStatus) {
          message.error(`anchor: ${mediaInfo.anchorName} not on the air`);
          return;
        }
        flv_load(mediaInfo.hasAudio);
      });
    }
  };

  const handleStop = () => {
    if (playRef.current) {
      playRef.current.pause();
      playRef.current.unload();
      playRef.current.detachMediaElement();
      playRef.current.destroy();
      playRef.current = undefined;
      setCanStop(false);
    }
  };

  const flv_load = (hasAudio: boolean) => {
    var mediaDataSource: Flv.MediaDataSource = {
      type: 'flv',
    };
    const liveInfo = getLiveInfo();
    if (!liveInfo) {
      return;
    }
    const serverURL = Env.directServerUrl;
    let videoUrl = `${serverURL}/live/${liveInfo.method}/${liveInfo.code}/${liveInfo.playAuthCode}.flv`;
    mediaDataSource['url'] = videoUrl;
    mediaDataSource['hasAudio'] = hasAudio;
    mediaDataSource['isLive'] = true;
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

  const handleViedoClick = (e: any) => {
    handlePlay();
  };

  useEffect(() => {
    const liveInfo = getLiveInfo();
    if (!liveInfo) {
      return;
    }
    const mediaInfoGetUrl = `/live/getMediaInfo/${liveInfo.method}/${liveInfo.code}/${liveInfo.playAuthCode}.flv`;
    BaseAPI.GET(mediaInfoGetUrl).then((mediaInfo: FlvMediaInfo) => {
      setFlvMediaInfo(mediaInfo);
    });

    const checkOnlineStatusInterval = setInterval(() => {
      if (fgOnlineStatusRef.current === true) {
        return;
      }
      const liveInfo = getLiveInfo();
      if (!liveInfo) {
        return;
      }
      const mediaInfoGetUrl = `/live/getMediaInfo/${liveInfo.method}/${liveInfo.code}/${liveInfo.playAuthCode}.flv`;
      BaseAPI.GET(mediaInfoGetUrl).then((mediaInfo: FlvMediaInfo) => {
        setFlvMediaInfo(mediaInfo);
      });
    }, 60000);

    const interval = setInterval(() => {
      if (videoElementRef.current && playRef.current) {
        setCanStop(true);
        const buffered = videoElementRef.current.buffered;
        if (videoElementRef.current.paused && buffered && buffered.length > 0) {
          const maxBufferedSec = 3 * 60;
          const currentTime = videoElementRef.current.currentTime;
          if (buffered.end(0) - currentTime > maxBufferedSec) {
            console.log('vedio paused, buffered max, unload the media data');
            playRef.current.pause();
            playRef.current.unload();
            playRef.current.detachMediaElement();
            playRef.current.destroy();
            playRef.current = undefined;
          }
        }
      } else {
        setCanStop(false);
      }
    }, 1000);
    return () => {
      clearInterval(checkOnlineStatusInterval);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Button
            type="primary"
            onClick={handlePlay}
            disabled={!flvMediaInfo.onlineStatus}
          >
            Play
          </Button>
          <Button type="primary" onClick={handleStop} disabled={!canStop}>
            Stop
          </Button>
          <Checkbox checked={flvMediaInfo.hasAudio} disabled={true}>
            hasAudio
          </Checkbox>
          <div>
            主播：<b>{flvMediaInfo.anchorName}</b>
          </div>
          <div>
            在线：
            {flvMediaInfo.onlineStatus ? (
              <span style={{ color: 'green' }}>是</span>
            ) : (
              <span style={{ color: 'red' }}>否</span>
            )}
          </div>
        </div>
        <div>
          <video
            ref={videoElementRef}
            onClick={handleViedoClick}
            className="centeredVideo"
            controls
            width="90%"
            poster={'./video-background.png'}
          >
            Your browser is too old which doesn't support HTML5 video.
          </video>
        </div>
      </div>
    </>
  );
};
export default LiveCore;
