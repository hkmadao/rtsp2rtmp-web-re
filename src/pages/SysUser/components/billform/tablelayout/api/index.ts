import * as API from '@/api';
import { TPageInfoInput } from '@/models';
import {
  TUser,
} from '../../../../models';
const ListAPI = {
  pageList: (params: TPageInfoInput) => {
    return API.POST(`/user/aqPage`, params);
  },
  getById: (id: string) => {
    return API.GET(`/user/getById/${id}`);
  },
  batchRemove: (params: TUser[]) => {
    return API.POST(`/user/batchRemove`, params);
  },
};

export default ListAPI;
