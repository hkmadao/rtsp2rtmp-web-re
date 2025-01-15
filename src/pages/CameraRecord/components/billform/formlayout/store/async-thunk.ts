import { createAsyncThunk } from '@reduxjs/toolkit';
import FormAPI from '../api';
import {
  TCameraRecord,
} from '../../../../models';
import { componentName } from '../conf';
import { TFormStore } from '../models';
export const toEdit = createAsyncThunk(
  `/toEdit`,
  async (params: { nodeData: any; selectedRow: TCameraRecord; }, thunkAPI) => {
    const { nodeData, selectedRow } = params;
    const detailData: TCameraRecord = await FormAPI.getById(selectedRow.idCameraRecord!);
    return { nodeData, detailData };
  },
);

export const reflesh = createAsyncThunk(
  `/reflesh`,
  async (param: void, thunkAPI) => {
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    const loadData: TCameraRecord = await FormAPI.getById(state.selectedRow?.idCameraRecord);
    return loadData;
  },
);

export const save = createAsyncThunk(
  `/save`,
  async (params: { actionType: 'add' | 'addAgain' | 'edit' }, thunkAPI) => {
    const { actionType } = params;
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    if (actionType === 'add' || actionType === 'addAgain') {
      const saveData: TCameraRecord = await FormAPI.add(state.formData);
      return {
        actionType,
        saveData,
      };
    }
    const saveData: TCameraRecord = await FormAPI.update(state.formData);
    return {
      actionType,
      saveData,
    };
  },
);