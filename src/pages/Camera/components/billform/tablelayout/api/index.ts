import * as API from '@/api';
import { TPageInfoInput } from '@/models';
import {
  TCamera,
} from '../../../../models';
const ListAPI = {
  pageList: (params: TPageInfoInput) => {
    return API.POST(`/camera/aqPage`, params);
  },
  getById: (id: string) => {
    return API.GET(`/camera/getById/${id}`);
  },
  batchRemove: (params: TCamera[]) => {
    return API.POST(`/camera/batchRemove`, params);
  },
  enabledChange: (params: TCamera): Promise<TCamera> => {
    return API.POST(`/camera/enabled`, params);
  },
  rtmpPushChange: (params: TCamera): Promise<TCamera> => {
    return API.POST(`/camera/rtmpPushChange`, params);
  },
  saveVideoChange: (params: TCamera): Promise<TCamera> => {
    return API.POST(`/camera/saveVideoChange`, params);
  },
  liveChange: (params: TCamera): Promise<TCamera> => {
    return API.POST(`/camera/liveChange`, params);
  },
  playAuthCodeReset: (params: TCamera): Promise<TCamera> => {
    return API.POST(`/camera/playAuthCodeReset`, params);
  },
};

export default ListAPI;
