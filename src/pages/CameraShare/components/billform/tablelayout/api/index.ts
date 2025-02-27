import * as API from '@/api';
import { TPageInfoInput } from '@/models';
import {
  TCameraShare,
} from '../../../../models';
const ListAPI = {
  pageList: (params: TPageInfoInput) => {
    return API.POST(`/cameraShare/aqPage`, params);
  },
  getById: (id: string) => {
    return API.GET(`/cameraShare/getById/${id}`);
  },
  batchRemove: (params: TCameraShare[]) => {
    return API.POST(`/cameraShare/batchRemove`, params);
  },
  enabledChange: (params: TCameraShare): Promise<TCameraShare> => {
    return API.POST(`/cameraShare/enabled`, params);
  },
  playAuthCodeReset: (params: TCameraShare): Promise<TCameraShare> => {
    return API.POST(`/cameraShare/playAuthCodeReset`, params);
  },
};

export default ListAPI;
