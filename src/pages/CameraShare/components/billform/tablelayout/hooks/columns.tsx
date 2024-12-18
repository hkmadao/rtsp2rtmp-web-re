import { Checkbox, Dropdown, Menu, TableColumnType, message } from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import {
  TCameraShare,
} from '../../../../models';
export const useMainTableColumns: () => TableColumnType<TCameraShare>[] =
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
          title: '摄像头分享主属性',
          dataIndex: 'id',
          key: 'id',
          render: (_dom: any, record: any) => {
            return <>{record.id ? record.id : '--'}</>;
          },
        },
        {
          width: 150,
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          render: (_dom: any, record: any) => {
            return <>{record.name ? record.name : '--'}</>;
          },
        },
        {
          width: 150,
          title: '权限码',
          dataIndex: 'authCode',
          key: 'authCode',
          render: (_dom: any, record: any) => {
            return <>{record.authCode ? record.authCode : '--'}</>;
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
          title: '创建时间',
          dataIndex: 'created',
          key: 'created',
          render: (_dom: any, record: any) => {
            return <>{record.created ? record.created : '--'}</>;
          },
        },
        {
          width: 150,
          title: '开始时间',
          dataIndex: 'startTime',
          key: 'startTime',
          render: (_dom: any, record: any) => {
            return <>{record.startTime ? record.startTime : '--'}</>;
          },
        },
        {
          width: 150,
          title: '结束时间',
          dataIndex: 'deadline',
          key: 'deadline',
          render: (_dom: any, record: any) => {
            return <>{record.deadline ? record.deadline : '--'}</>;
          },
        },
        {
          width: 150,
          title: '摄像头',
          dataIndex: [
            'cameraId',
            'camera',
          ],
          key: 'cameraId',
          render: (_dom: any, record: any) => {
            const refConf = getRefByAttr(
              EPartName.Header,
              "cameraShare",
              'cameraId',
              billformConf!,
            );
            if (refConf) {
              const refData = (record as any).camera;
              if (refData) {
                return refData[refConf.displayProp!];
              }
            }
          },
        },

    ];
  };