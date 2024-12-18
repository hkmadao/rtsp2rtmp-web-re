import { createAsyncThunk } from '@reduxjs/toolkit';
import FormAPI from '../api';
import {
  TCameraShare,
} from '../../../../models';
import { componentName } from '../conf';
import { TFormStore } from '../models';
export const toEdit = createAsyncThunk(
  `/toEdit`,
  async (params: { nodeData: any; selectedRow: TCameraShare; }, thunkAPI) => {
    const { nodeData, selectedRow } = params;
    const detailData: TCameraShare = await FormAPI.getById(selectedRow.id!);
    return { nodeData, detailData };
  },
);

export const reflesh = createAsyncThunk(
  `/reflesh`,
  async (param: void, thunkAPI) => {
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    const loadData: TCameraShare = await FormAPI.getById(state.selectedRow?.id);
    return loadData;
  },
);

export const save = createAsyncThunk(
  `/save`,
  async (params: { actionType: 'add' | 'addAgain' | 'edit' }, thunkAPI) => {
    const { actionType } = params;
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    if (actionType === 'add' || actionType === 'addAgain') {
      const saveData: TCameraShare = await FormAPI.add(state.formData);
      return {
        actionType,
        saveData,
      };
    }
    const saveData: TCameraShare = await FormAPI.update(state.formData);
    return {
      actionType,
      saveData,
    };
  },
);
