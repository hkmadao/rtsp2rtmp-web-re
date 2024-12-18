import {
  configureStore,
  createSlice,
  CaseReducer,
  PayloadAction,
  nanoid,
} from '@reduxjs/toolkit';
import { arrToTree } from '@/util';
import { treeConf } from '../../../conf';
import { fetchTree } from './async-thunk';
import { componentName } from '../conf';
import { initialState } from './initial-state';
import * as reducers from './actions';

export * from './async-thunk';

export const leftTreeSlice = createSlice({
  name: componentName,
  initialState: initialState,
  reducers: {
    ...reducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTree.pending, (state, action) => {})
      .addCase(fetchTree.rejected, (state, action) => {})
      .addCase(fetchTree.fulfilled, (state, action) => {
        const treeData = arrToTree(
          treeConf?.firstTreeRef?.parentIdAttr ?? 'idParent',
          treeConf?.firstTreeRef?.keyAttr!,
          treeConf?.firstTreeRef?.labelAttr!,
          action.payload,
          true,
          null,
        );
        state.sourchTreeData = treeData;
        state.treeData = treeData;
        if (
          treeData &&
          treeData.length > 0 &&
          state.expandedKeys.length === 0
        ) {
          state.expandedKeys = [treeData[0].key];
        }
      });
  },
});

export const actions = leftTreeSlice.actions;

const reducer: any = {};
reducer[leftTreeSlice.name] = leftTreeSlice.reducer;

export default configureStore({
  reducer: {
    ...reducer,
  },
});
