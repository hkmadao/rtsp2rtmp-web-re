import * as API from '@/api';
import { TPageInfoInput } from '@/models';
import {
  TCameraRecord,
} from '../../../../models';
const ListAPI = {
  pageList: (params: TPageInfoInput) => {
    return API.POST(`/cameraRecord/aqPage`, params);
  },
  getById: (id: string) => {
    return API.GET(`/cameraRecord/getById/${id}`);
  },
  batchRemove: (params: TCameraRecord[]) => {
    return API.POST(`/cameraRecord/batchRemove`, params);
  },
};

export default ListAPI;
