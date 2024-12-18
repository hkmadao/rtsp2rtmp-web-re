import { createAsyncThunk } from '@reduxjs/toolkit';
import FormAPI from '../api';
import {
  TCamera,
} from '../../../../models';
import { componentName } from '../conf';
import { TFormStore } from '../models';
export const toEdit = createAsyncThunk(
  `/toEdit`,
  async (params: { nodeData: any; selectedRow: TCamera; }, thunkAPI) => {
    const { nodeData, selectedRow } = params;
    const detailData: TCamera = await FormAPI.getById(selectedRow.id!);
    return { nodeData, detailData };
  },
);

export const reflesh = createAsyncThunk(
  `/reflesh`,
  async (param: void, thunkAPI) => {
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    const loadData: TCamera = await FormAPI.getById(state.selectedRow?.id);
    return loadData;
  },
);

export const save = createAsyncThunk(
  `/save`,
  async (params: { actionType: 'add' | 'addAgain' | 'edit' }, thunkAPI) => {
    const { actionType } = params;
    const state: TFormStore = (thunkAPI.getState() as any)[componentName];
    if (actionType === 'add' || actionType === 'addAgain') {
      const saveData: TCamera = await FormAPI.add(state.formData);
      return {
        actionType,
        saveData,
      };
    }
    const saveData: TCamera = await FormAPI.update(state.formData);
    return {
      actionType,
      saveData,
    };
  },
);
