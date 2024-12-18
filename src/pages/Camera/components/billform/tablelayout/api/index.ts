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
};

export default ListAPI;
