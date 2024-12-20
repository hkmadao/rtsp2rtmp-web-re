import { FC, Key, memo, useEffect, useState, useRef } from 'react';
import { Table, Tabs } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Observer, TMessage } from '@/util/observer';
import { useMainTableColumns } from './hooks/columns';
import { subject } from '../../../conf';
import styles from './styles.less';
import {
  batchRemove,
  fetchByTreeNode,
  pageChange,
  reflesh,
  search,
  statusChange,
  playAuthCodeReset,
} from './store';
import { useStoreData, useIdUiConf } from './hooks';
import { actions } from './store';
import { TCamera } from '../../../models';
const MainTableLayout: FC = () => {
  const idUiConf = useIdUiConf();
  const columns = useMainTableColumns();
  const [rowSelectionType, setRowSelectionType] = useState<
    'checkbox' | 'radio'
  >('radio');
  const tableStore = useStoreData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reflesh());
  }, []);

  useEffect(() => {
    if (!idUiConf) {
      return;
    }
    const treeNodeObserver: Observer = {
      topic: 'treeNodeSelected',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(fetchByTreeNode(message));
        })();
      },
    };
    subject.subscribe(treeNodeObserver);

    const treeNodeCancelObserver: Observer = {
      topic: 'treeSelectCancel',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(actions.setSelectedTreeNode(undefined));
        })();
      },
    };
    subject.subscribe(treeNodeCancelObserver);

    const searchObserver: Observer = {
      topic: 'search',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(search(message));
        })();
      },
    };
    subject.subscribe(searchObserver);

    const checkboxObserver: Observer = {
      topic: 'checkbox',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(actions.setSelectedRowKeys([]));
          setRowSelectionType('checkbox');
        })();
      },
    };
    subject.subscribe(checkboxObserver);

    const radioObserver: Observer = {
      topic: 'radio',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(actions.setSelectedRowKeys([]));
          setRowSelectionType('radio');
        })();
      },
    };
    subject.subscribe(radioObserver);

    const addSuccessObserver: Observer = {
      topic: 'addSuccess',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          const addAfterData = message.data;
          dispatch(actions.addNewRecords(addAfterData));
          setRowSelectionType('radio');
        })();
      },
    };
    subject.subscribe(addSuccessObserver);

    const updateSuccessObserver: Observer = {
      topic: 'updateSuccess',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          const updateAfterData = message.data;
          dispatch(actions.updateRecord(updateAfterData));
          setRowSelectionType('radio');
        })();
      },
    };
    subject.subscribe(updateSuccessObserver);

    const deletesObserver: Observer = {
      topic: 'deletes',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(batchRemove(message));
        })();
      },
    };
    subject.subscribe(deletesObserver);

    const refleshObserver: Observer = {
      topic: 'reflesh',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(reflesh());
        })();
      },
    };
    subject.subscribe(refleshObserver);

    const enabledChangeObserver: Observer = {
      topic: 'enabledChange',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(statusChange('enabled'));
        })();
      },
    };
    subject.subscribe(enabledChangeObserver);

    const liveChangeObserver: Observer = {
      topic: 'liveChange',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(statusChange('live'));
        })();
      },
    };
    subject.subscribe(liveChangeObserver);

    const rtmpPushStatusChangeObserver: Observer = {
      topic: 'rtmpPushStatusChange',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(statusChange('rtmpPushStatus'));
        })();
      },
    };
    subject.subscribe(rtmpPushStatusChangeObserver);

    const saveVideoChangeObserver: Observer = {
      topic: 'saveVideoChange',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(statusChange('saveVideo'));
        })();
      },
    };
    subject.subscribe(saveVideoChangeObserver);

    const playAuthCodeResetObserver: Observer = {
      topic: 'playAuthCodeReset',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(playAuthCodeReset(message));
        })();
      },
    };
    subject.subscribe(playAuthCodeResetObserver);

    //销毁观察者
    return () => {
      subject.unsubsribe(treeNodeObserver);
      subject.unsubsribe(treeNodeCancelObserver);
      subject.unsubsribe(searchObserver);
      subject.unsubsribe(checkboxObserver);
      subject.unsubsribe(radioObserver);
      subject.unsubsribe(addSuccessObserver);
      subject.unsubsribe(updateSuccessObserver);
      subject.unsubsribe(deletesObserver);
      subject.unsubsribe(refleshObserver);
      subject.unsubsribe(enabledChangeObserver);
      subject.unsubsribe(liveChangeObserver);
      subject.unsubsribe(rtmpPushStatusChangeObserver);
      subject.unsubsribe(saveVideoChangeObserver);
      subject.unsubsribe(playAuthCodeResetObserver);
    };
  }, [idUiConf]);

  const onPageChange = (page: number, pageSize: number) => {
    (async () => {
      dispatch(pageChange({ page, pageSize }));
    })();
  };

  const showTotal = (total: number) => {
    return <>总数：{total}</>;
  };

  const onChange = (selectedRowKeys: Key[], selectedRows: TCamera[]) => {};

  const handleSelect = (
    record: TCamera,
    select: boolean,
    selectedRows: TCamera[],
  ) => {
    if (rowSelectionType == 'checkbox') {
      const newKeys = selectedRows.map((r) => r.id!);
      dispatch(actions.setSelectedRowKeys(newKeys));
    } else {
      dispatch(actions.setSelectedRowKeys([record.id!]));
    }
  };

  const onRow = (record: TCamera) => {
    return {
      onClick: (event: any) => {
        if (rowSelectionType == 'checkbox') {
          let newKeys = tableStore.selectedRowKeys?.slice() || [];
          if (!newKeys.includes(record.id!)) {
            newKeys?.push(record.id!);
            dispatch(actions.setSelectedRowKeys(newKeys));
          } else {
            newKeys = newKeys?.filter((idKey) => idKey !== record.id);
            dispatch(actions.setSelectedRowKeys(newKeys));
          }
          dispatch(dispatch(actions.setSelectedRowKeys(newKeys)));
        } else {
          dispatch(actions.setSelectedRowKeys([record.id!]));
        }
      }, // 点击行
      onDoubleClick: (event: any) => {},
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };

  return (
    <>
      <Table
        size={'small'}
        rowKey={'id'}
        onRow={onRow}
        columns={columns}
        dataSource={tableStore.tableData}
        scroll={{ x: 300, y: 500 }}
        rowSelection={
          rowSelectionType
            ? {
                type: rowSelectionType,
                onChange: onChange,
                selectedRowKeys: tableStore.selectedRowKeys,
                onSelect: handleSelect,
              }
            : undefined
        }
        pagination={{
          total: tableStore.totalCount,
          current: tableStore.pageIndex,
          pageSize: tableStore.pageSize,
          onChange: onPageChange,
          showTotal,
        }}
      />
    </>
  );
};

export default MainTableLayout;
