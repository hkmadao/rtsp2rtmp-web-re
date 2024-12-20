import * as API from '@/api';
import {
  TCameraShare,
} from '../../../../models';
const FormAPI = {
  getById: (id?: string) => {
    return API.GET(`/cameraShare/getById/${id}`);
  },
  add: (params: TCameraShare) => {
    return API.POST(`/cameraShare/add`, params);
  },
  update: (params: TCameraShare) => {
    return API.POST(`/cameraShare/update`, params);
  },
  enabledChange: (params: TCameraShare) => {
    return API.POST(`/cameraShare/enabled`, params);
  },
  remove: (params: TCameraShare) => {
    return API.POST(`/cameraShare/remove`, params);
  },
};

export default FormAPI;
