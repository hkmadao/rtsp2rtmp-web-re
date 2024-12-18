import * as API from '@/api';
import {
  TUser,
} from '../../../../models';
const FormAPI = {
  getById: (id?: string) => {
    return API.GET(`/user/getById/${id}`);
  },
  add: (params: TUser) => {
    return API.POST(`/user/add`, params);
  },
  update: (params: TUser) => {
    return API.POST(`/user/update`, params);
  },
  remove: (params: TUser) => {
    return API.POST(`/user/remove`, params);
  },
};

export default FormAPI;
