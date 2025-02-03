import { TTableToolBarStore } from '../models';

export const initialState: TTableToolBarStore = {
  status: 'idle',
  fgDisabled: false,
  rowSelectionType: 'radio',
  selectRows: [],
};
