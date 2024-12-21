import { createAsyncThunk } from '@reduxjs/toolkit';
import { TMessage } from '@/util';
import { componentName } from '../conf';
import { andLogicNode, equalFilterNode, EDirection, TFilterNode, TPageInfo, TPageInfoInput, TTree, stringFilterParam, buildFiltersBySearchRef, andOrLogicNode } from '@/models';
import { TTableStore } from '../models';
import { queryConf, tableConf, } from '../../../../conf';
import ListAPI from '../api';
import {
  TCameraShare,
} from '../../../../models';
const searcheRefs = queryConf?.searchRefs;

export const fetchByTreeNode = createAsyncThunk(
  `${tableConf?.name}/fetchByTreeNode`,
  async (message: TMessage, thunkAPI) => {
    if (!message) {
      return;
    }
    const selectedTreeNode: TTree = message.data as TTree;
    const fns: TFilterNode[] = [];
    if (selectedTreeNode) {
      const treeIdFn: TFilterNode = equalFilterNode('cameraId', stringFilterParam(selectedTreeNode['id']));
      fns.push(treeIdFn);
    }
    const params: TPageInfoInput = {
      pageIndex: 1,
      pageSize: 10,
      logicNode: andLogicNode(fns)(),
      orders: [
        {
          property: 'id',
          direction: EDirection.ASC,
          ignoreCase: false,
        },
      ],
    };
    const pageInfo: TPageInfo<TCameraShare> = await ListAPI.pageList(
      params,
    );
    return {
      selectedTreeNode,
      pageInfo,
    }
  },
);

export const search = createAsyncThunk(
  `${tableConf?.name}/search`,
  async (message: TMessage, thunkAPI) => {
    const state: TTableStore = (thunkAPI.getState() as any)[componentName];
    if (!message || message.consumerIds.includes(componentName)) {
      return;
    }
    const searchData = message.data;
    const fns: TFilterNode[] = [];
    if (state.selectedTreeNode) {
      const treeIdFn: TFilterNode = equalFilterNode('cameraId', stringFilterParam(state.selectedTreeNode['id']));
      fns.push(treeIdFn);
    }
    const searchFilter = buildFiltersBySearchRef(searchData, searcheRefs);
    if (!searchFilter) {
      return;
    }
    fns.push(...searchFilter.andFilters);
    const params: TPageInfoInput = {
      pageIndex: 1,
      pageSize: 10,
      logicNode: andOrLogicNode(fns, searchFilter.orFilters),
      orders: [
        {
          property: 'id',
          direction: EDirection.ASC,
          ignoreCase: false,
        },
      ],
    };
    const pageInfo: TPageInfo<TCameraShare> = await ListAPI.pageList(
      params,
    );
    return {
      searchData,
      pageInfo,
    }
  },
);

export const reflesh = createAsyncThunk(
  `${tableConf?.name}/reflesh`,
  async (params: void, thunkAPI) => {
    const state: TTableStore = (thunkAPI.getState() as any)[componentName];
    const searchData = state.searchData;
    const fns: TFilterNode[] = [];
    if (state.selectedTreeNode) {
      const treeIdFn: TFilterNode = equalFilterNode('cameraId', stringFilterParam(state.selectedTreeNode['id']));
      fns.push(treeIdFn);
    }
    const searchFilter = buildFiltersBySearchRef(searchData, searcheRefs);
    if (!searchFilter) {
      return;
    }
    fns.push(...searchFilter.andFilters);
    const searchParam: TPageInfoInput = {
      pageIndex: 1,
      pageSize: 10,
      logicNode: andOrLogicNode(fns, searchFilter.orFilters),
      orders: [
        {
          property: 'id',
          direction: EDirection.ASC,
          ignoreCase: false,
        },
      ],
    };
    const pageInfo: TPageInfo<TCameraShare> = await ListAPI.pageList(
      searchParam,
    );
    return pageInfo
  },
);

export const pageChange = createAsyncThunk(
  `${tableConf?.name}/pageChange`,
  async (params: { page: number, pageSize: number }, thunkAPI) => {
    const { page, pageSize } = params;
    const state: TTableStore = (thunkAPI.getState() as any)[componentName];
    const fns: TFilterNode[] = [];
    if (state.selectedTreeNode) {
      const treeIdFn: TFilterNode = equalFilterNode('cameraId', stringFilterParam(state.selectedTreeNode['id']));
      fns.push(treeIdFn);
    }
    const searchData = state.searchData;
    const searchFilter = buildFiltersBySearchRef(searchData, searcheRefs);
    if (!searchFilter) {
      return;
    }
    fns.push(...searchFilter.andFilters);
    const queyrParams: TPageInfoInput = {
      pageIndex: page,
      pageSize: pageSize,
      logicNode: andOrLogicNode(fns, searchFilter.orFilters),
      orders: [
        {
          property: 'id',
          direction: EDirection.ASC,
          ignoreCase: false,
        },
      ],
    };
    const pageInfo: TPageInfo<TCameraShare> = await ListAPI.pageList(
      queyrParams,
    );
    return pageInfo
  },
);

export const batchRemove = createAsyncThunk(
  `${tableConf?.name}/batchRemove`,
  async (message: TMessage, thunkAPI) => {
    if (!message || message.consumerIds.includes(componentName)) {
      return;
    }
    const state: TTableStore = (thunkAPI.getState() as any)[componentName];
    const deleteDatas = state.tableData?.filter(d => state.selectedRowKeys?.includes(d.id!));
    if (!deleteDatas || deleteDatas.length === 0) {
      return;
    }
    await ListAPI.batchRemove(deleteDatas);
    const fns: TFilterNode[] = [];
    if (state.selectedTreeNode) {
      const treeIdFn: TFilterNode = equalFilterNode('cameraId', stringFilterParam(state.selectedTreeNode['id']));
      fns.push(treeIdFn);
    }
    const searchData = state.searchData;
    const searchFilter = buildFiltersBySearchRef(searchData, searcheRefs);
    if (!searchFilter) {
      return;
    }
    fns.push(...searchFilter.andFilters);
    const params: TPageInfoInput = {
      pageIndex: 1,
      pageSize: 10,
      logicNode: andLogicNode(fns)(),
      orders: [
        {
          property: 'id',
          direction: EDirection.ASC,
          ignoreCase: false,
        },
      ],
    };
    const pageInfo: TPageInfo<TCameraShare> = await ListAPI.pageList(
      params,
    );
    return pageInfo;
  },
);

export const statusChange = createAsyncThunk(
  `${tableConf?.name}/statusChange`,
  async (changeType: 'enabled', thunkAPI) => {
    const state: TTableStore = (thunkAPI.getState() as any)[componentName];
    const immutableData = state.tableData?.find(d => state.selectedRowKeys?.includes(d.id!));
    if (!immutableData) {
      console.error("no row to selected")
      return;
    }
    const toChangeData = { ...immutableData };
    toChangeData[changeType] = !(toChangeData[changeType]);
    if (changeType === 'enabled') {
      const changeData = await ListAPI.enabledChange(toChangeData);
      return changeData;
    }
  },
);

export const playAuthCodeReset = createAsyncThunk(
  `${tableConf?.name}/playAuthCodeReset`,
  async (message: TMessage, thunkAPI) => {
    if (!message || message.consumerIds.includes(componentName)) {
      return;
    }
    const state: TTableStore = (thunkAPI.getState() as any)[componentName];
    const immutableData = state.tableData?.find(d => state.selectedRowKeys?.includes(d.id!));
    if (!immutableData) {
      console.error("no row to selected")
      return;
    }
    const toChangeData = { ...immutableData };
    const changeData = await ListAPI.playAuthCodeReset(toChangeData);
    return changeData;
  },
);