import * as API from '@/api';
import {
  TCamera,
} from '../../../../models';
const FormAPI = {
  getById: (id?: string) => {
    return API.GET(`/camera/getById/${id}`);
  },
  add: (params: TCamera) => {
    return API.POST(`/camera/add`, params);
  },
  update: (params: TCamera) => {
    return API.POST(`/camera/update`, params);
  },
  remove: (params: TCamera) => {
    return API.POST(`/camera/remove`, params);
  },
};

export default FormAPI;
