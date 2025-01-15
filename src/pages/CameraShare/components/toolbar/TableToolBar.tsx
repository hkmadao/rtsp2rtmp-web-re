import { FC, Key, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { Observer, TMessage } from '@/util/observer';
import { subject, actionTableConf } from '../../conf';
import { TTree } from '@/models';
import Live, { TLiveInfo } from '@/components/Live';
import { TCameraShare } from '../../models';
import CopyToClipboard from 'react-copy-to-clipboard';
import Env from '@/conf/env';

const TableToolBar: FC<{
  idLayout: string;
  /**组件是否是禁用状态 */
  fgDisabled: boolean;
}> = ({ idLayout, fgDisabled }) => {
  const [componentFgDiabled, setComponentFgDiabled] =
    useState<boolean>(fgDisabled);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [multiButtonContent, setMultiButtonContent] = useState<string>('多选');
  const [nodeTreeData, setTreeNodeData] = useState<TTree>();
  const [selectRows, setSelectRows] = useState<any[]>([]);
  const [playPageUrl, setPlayPageUrl] = useState<string>('');
  const [playUrl, setPlayUrl] = useState<string>('');
  const [rowSelectionType, setRowSelectionType] = useState<
    'checkbox' | 'radio'
  >('radio');

  useEffect(() => {
    setComponentFgDiabled(fgDisabled);
  }, [fgDisabled]);

  useEffect(() => {
    const treeNodeObserver: Observer = {
      topic: 'treeNodeSelected',
      consumerId: idLayout,
      update: function (message: TMessage): void {
        (async () => {
          if (!message) {
            return;
          }
          const nodeData: TTree = message?.data as TTree;
          setTreeNodeData(nodeData);
        })();
      },
    };
    subject.subscribe(treeNodeObserver);

    const treeNodeCancelObserver: Observer = {
      topic: 'treeSelectCancel',
      consumerId: idLayout,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idLayout)) {
            return;
          }
          setTreeNodeData(undefined);
        })();
      },
    };
    subject.subscribe(treeNodeCancelObserver);

    const selectRowsObserver: Observer = {
      topic: 'selectRows',
      consumerId: idLayout,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idLayout)) {
          return;
        }
        const rows: TCameraShare[] = message.data;
        setSelectRows(rows);
        if (rows.length === 1) {
          const row = rows[0];
          const shareUrl = `${Env.directServerUrl}/live/temp/${row.camera?.code}/${row.authCode}.flv`;
          setPlayUrl(shareUrl);
          const href = window.location.href;
          let baseUrl = href.substring(0, href.indexOf('#'));
          const sharePageUrl = `${baseUrl}#/live/live?method=temp&code=${row.camera?.code}&authCode=${row.authCode}`;
          setPlayPageUrl(sharePageUrl);
        }
      },
    };
    subject.subscribe(selectRowsObserver);

    const listReloadObserver: Observer = {
      topic: 'listReload',
      consumerId: idLayout,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idLayout)) {
          return;
        }
        setSelectRows([])
      },
    };
    subject.subscribe(listReloadObserver);

    //销毁观察者
    return () => {
      subject.unsubsribe(treeNodeObserver);
      subject.unsubsribe(treeNodeCancelObserver);
      subject.unsubsribe(selectRowsObserver);
      subject.unsubsribe(listReloadObserver);
    };
  }, []);

  const handleToAdd = () => {
    subject.publish({
      topic: 'toAdd',
      producerId: idLayout,
      data: { treeSelectedNode: nodeTreeData },
    });
    subject.publish({
      topic: '/page/change',
      producerId: idLayout,
      data: 'form',
    });
  };

  const handleToEdit = () => {
    subject.publish({
      topic: 'toEdit',
      producerId: idLayout,
      data: { treeSelectedNode: nodeTreeData, selectedRow: selectRows[0] },
    });
    subject.publish({
      topic: '/page/change',
      producerId: idLayout,
      data: 'form',
    });
  };

  const handleRowsDelete = () => {
    setIsModalVisible(true);
  };

  const handleRowSelectType = () => {
    if (rowSelectionType !== 'checkbox') {
      setMultiButtonContent('取消多选');
      subject.publish({
        topic: 'checkbox',
        producerId: idLayout,
        data: undefined,
      });
      setRowSelectionType('checkbox');
      setSelectRows([]);
      return;
    }
    subject.publish({
      topic: 'radio',
      producerId: idLayout,
      data: undefined,
    });
    setRowSelectionType('radio');
    setMultiButtonContent('多选');
    setSelectRows([]);
  };

  const handleOk = () => {
    subject.publish({
      topic: 'deletes',
      producerId: idLayout,
      data: undefined,
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleReflesh = () => {
    subject.publish({
      topic: 'reflesh',
      producerId: idLayout,
      data: undefined,
    });
  };
  const handleEnabledChange = () => {
    subject.publish({
      topic: 'enabledChange',
      producerId: idLayout,
      data: undefined,
    });
  };
  const handlePlayAuthRefresh = () => {
    subject.publish({
      topic: 'playAuthCodeReset',
      producerId: idLayout,
      data: undefined,
    });
  };
  const getLiveInfo = () => {
    if (selectRows?.length !== 1) {
      console.error('no row selected or more than one row selected');
      return;
    }
    const cameraShare: TCameraShare = selectRows[0];
    if (!cameraShare.camera?.code || !cameraShare.authCode) {
      console.error('code or playAuthCode is empty');
      return;
    }
    const liveInfo: TLiveInfo = {
      method: 'temp',
      code: cameraShare.camera.code,
      playAuthCode: cameraShare.authCode,
    };
    return liveInfo;
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: '0 1 auto',
          gap: actionTableConf?.gap ?? '10px',
          justifyContent: actionTableConf?.justifyContent ?? 'start',
          flexWrap: 'wrap',
        }}
      >
        <Button
          key={'3_13WIAgOmHve3m76HklW'}
          size={'middle'}
          type={'primary'}
          disabled={!nodeTreeData}
          onClick={handleToAdd}
        >
          {'新增'}
        </Button>
        <Button
          key={'6J7X95__8C1OzXqbKTrp9'}
          size={'middle'}
          type={'primary'}
          disabled={selectRows?.length !== 1}
          onClick={handleToEdit}
        >
          {'编辑'}
        </Button>
        <Button
          key={'oKZO0RHHFWAYWRvsC7RMW'}
          size={'middle'}
          type={'primary'}
          disabled={!nodeTreeData}
          hidden={rowSelectionType === 'radio'}
          onClick={handleRowSelectType}
        >
          {'单选'}
        </Button>
        <Button
          key={'A20J1aDvpQHdVDlEeR_Xi'}
          size={'middle'}
          type={'primary'}
          disabled={!nodeTreeData}
          hidden={rowSelectionType === 'checkbox'}
          onClick={handleRowSelectType}
        >
          {'多选'}
        </Button>
        <Button
          key={'mSyqueRzvHx_WCb0IifhT'}
          size={'middle'}
          type={'primary'}
          disabled={selectRows?.length == 0}
          onClick={handleRowsDelete}
        >
          {'删除'}
        </Button>
        <Button
          key={'M3V-JBmVeJoSsW3b0ZkG_'}
          size={'middle'}
          type={'primary'}
          disabled={selectRows?.length !== 1}
          onClick={handleEnabledChange}
        >
          {selectRows?.length === 1 && !selectRows[0]['enabled']
            ? '启用'
            : '禁用'}
        </Button>
        <Button
          size={'middle'}
          type={'primary'}
          disabled={selectRows?.length !== 1}
          onClick={handlePlayAuthRefresh}
        >
          {'刷新播放权限码'}
        </Button>
        <Live disabled={selectRows?.length !== 1} getLiveInfo={getLiveInfo} />
        <CopyToClipboard text={playPageUrl}>
          <Button
            type={'primary'}
            disabled={selectRows?.length !== 1}
            size={'middle'}
          >
            复制播放页地址
          </Button>
        </CopyToClipboard>
        <CopyToClipboard text={playUrl}>
          <Button
            type={'primary'}
            disabled={selectRows?.length !== 1}
            size={'middle'}
          >
            复制FLV播放地址
          </Button>
        </CopyToClipboard>
      </div>
      <Modal
        title="删除确认"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>确定删除所选记录？</p>
      </Modal>
    </>
  );
};

export default TableToolBar;
