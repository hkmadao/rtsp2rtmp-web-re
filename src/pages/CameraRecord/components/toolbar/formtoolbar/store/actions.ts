import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TFormToolbarStore } from '../models';
import { TTree } from '@/models';
import { Key } from 'react';
import { subject } from '../../../../conf';

export const setComponentInfo: CaseReducer<
  TFormToolbarStore,
  PayloadAction<{ idUiConf: string; fgDisabled: boolean }>
> = (state, action) => {
  const { idUiConf, fgDisabled } = action.payload;
  state.idUiConf = idUiConf;
  state.fgDisabled = fgDisabled;
};

export const setFgAdd: CaseReducer<
  TFormToolbarStore,
  PayloadAction<boolean>
> = (state, action) => {
  const fgAdd = action.payload;
  state.fgAdd = fgAdd;
};
