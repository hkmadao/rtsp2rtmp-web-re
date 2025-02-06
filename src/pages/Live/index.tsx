import { FC } from 'react';
import { message } from 'antd';
import LiveCore, { TLiveInfo } from '@/components/LiveCore';

const getQueryString = (name: string) => {
  let reg = new RegExp('(^|&|\\?)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.hash.substring(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
};

const getLiveInfo = () => {
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
  if (!liveInfo) {
    message.error('getLiveInfo error');
    return;
  }
  if (!liveInfo.method || !liveInfo.code || !liveInfo.playAuthCode) {
    return;
  }
  return liveInfo;
};

const Live: FC = () => {
  return (
    <>
      <div style={{ display: 'flex', flex: 'auto', margin: '20px' }}>
        <LiveCore getLiveInfo={getLiveInfo} />
      </div>
    </>
  );
};
export default Live;
