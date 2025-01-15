import * as API from '@/api';
import {
  TCameraRecord,
} from '../../../../models';
const FormAPI = {
  getById: (id?: string) => {
    return API.GET(`/cameraRecord/getById/${id}`);
  },
  add: (params: TCameraRecord) => {
    return API.POST(`/cameraRecord/add`, params);
  },
  update: (params: TCameraRecord) => {
    return API.POST(`/cameraRecord/update`, params);
  },
  remove: (params: TCameraRecord) => {
    return API.POST(`/cameraRecord/remove`, params);
  },
};

export default FormAPI;
