import { Checkbox, Dropdown, Menu, TableColumnType, message } from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import CustomDateText from '@/components/CustomDateText';
import {
  TCamera,
} from '../../../../models';
export const useMainTableColumns: () => TableColumnType<TCamera>[] =
  () => {
  const dispatch = useDispatch();
  const toEdit = () => {
    message.error("to be complate");
  };

  const detail = () => {
    message.error("to be complate");
  };

  const remove = () => {
    message.error("to be complate");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={toEdit}>
        编辑
      </Menu.Item>
      <Menu.Item key="2" onClick={detail}>
        详情
      </Menu.Item>
      <Menu.Item key="3" onClick={remove}>
        删除
      </Menu.Item>
    </Menu>
  );

    return [
        {
          width: 150,
          title: '摄像头主属性',
          dataIndex: 'id',
          key: 'id',
          render: (_dom: any, record: any) => {
            return <>{record.id ? record.id : '--'}</>;
          },
        },
        {
          width: 150,
          title: '编号',
          dataIndex: 'code',
          key: 'code',
          render: (_dom: any, record: any) => {
            return <>{record.code ? record.code : '--'}</>;
          },
        },
        {
          width: 150,
          title: 'rtsp地址',
          dataIndex: 'rtspUrl',
          key: 'rtspUrl',
          render: (_dom: any, record: any) => {
            return <>{record.rtspUrl ? record.rtspUrl : '--'}</>;
          },
        },
        {
          width: 150,
          title: 'rtmp推送地址',
          dataIndex: 'rtmpUrl',
          key: 'rtmpUrl',
          render: (_dom: any, record: any) => {
            return <>{record.rtmpUrl ? record.rtmpUrl : '--'}</>;
          },
        },
        {
          width: 150,
          title: '播放权限码',
          dataIndex: 'playAuthCode',
          key: 'playAuthCode',
          render: (_dom: any, record: any) => {
            return <>{record.playAuthCode ? record.playAuthCode : '--'}</>;
          },
        },
        {
          width: 150,
          title: '在线状态',
          dataIndex: 'onlineStatus',
          key: 'onlineStatus',
          render: (_dom: any, record: any) => {
            return <><Checkbox checked={record.onlineStatus ?? false} /></>;
          },
        },
        {
          width: 150,
          title: '启用状态',
          dataIndex: 'enabled',
          key: 'enabled',
          render: (_dom: any, record: any) => {
            return <><Checkbox checked={record.enabled ?? false} /></>;
          },
        },
        {
          width: 150,
          title: 'rtmp推送状态',
          dataIndex: 'rtmpPushStatus',
          key: 'rtmpPushStatus',
          render: (_dom: any, record: any) => {
            return <><Checkbox checked={record.rtmpPushStatus ?? false} /></>;
          },
        },
        {
          width: 150,
          title: '保存录像状态',
          dataIndex: 'saveVideo',
          key: 'saveVideo',
          render: (_dom: any, record: any) => {
            return <><Checkbox checked={record.saveVideo ?? false} /></>;
          },
        },
        {
          width: 150,
          title: '直播状态',
          dataIndex: 'live',
          key: 'live',
          render: (_dom: any, record: any) => {
            return <><Checkbox checked={record.live ?? false} /></>;
          },
        },
        {
          width: 150,
          title: '创建时间',
          dataIndex: 'created',
          key: 'created',
          render: (_dom: any, record: any) => {
            return (
              <>
                <CustomDateText
                  value={  record.created  }
                  format="YYYY-MM-DDTHH:mm:ssZ"
                  displayFormat="YYYY-MM-DD HH:mm:ss"
                />
              </>
            );
          },
        },

    ];
  };