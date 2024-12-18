import { Checkbox, Dropdown, Menu, TableColumnType, message } from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import CustomDateTimeText from '@/components/CustomDateTimeText';
import {
  TUser,
} from '../../../../models';
export const useMainTableColumns: () => TableColumnType<TUser>[] =
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
          title: '系统用户id',
          dataIndex: 'idUser',
          key: 'idUser',
          render: (_dom: any, record: any) => {
            return <>{record.idUser ? record.idUser : '--'}</>;
          },
        },
        {
          width: 150,
          title: '登录账号 ',
          dataIndex: 'account',
          key: 'account',
          render: (_dom: any, record: any) => {
            return <>{record.account ? record.account : '--'}</>;
          },
        },
        {
          width: 150,
          title: '用户密码 ',
          dataIndex: 'userPwd',
          key: 'userPwd',
          render: (_dom: any, record: any) => {
            return <>{record.userPwd ? record.userPwd : '--'}</>;
          },
        },
        {
          width: 150,
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone',
          render: (_dom: any, record: any) => {
            return <>{record.phone ? record.phone : '--'}</>;
          },
        },
        {
          width: 150,
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          render: (_dom: any, record: any) => {
            return <>{record.email ? record.email : '--'}</>;
          },
        },
        {
          width: 150,
          title: '姓名 ',
          dataIndex: 'name',
          key: 'name',
          render: (_dom: any, record: any) => {
            return <>{record.name ? record.name : '--'}</>;
          },
        },
        {
          width: 150,
          title: '昵称',
          dataIndex: 'nickName',
          key: 'nickName',
          render: (_dom: any, record: any) => {
            return <>{record.nickName ? record.nickName : '--'}</>;
          },
        },
        {
          width: 150,
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          render: (_dom: any, record: any) => {
            return <>{record.gender ? record.gender : '--'}</>;
          },
        },
        {
          width: 150,
          title: '启用标志',
          dataIndex: 'fgActive',
          key: 'fgActive',
          render: (_dom: any, record: any) => {
            return <><Checkbox checked={record.fgActive ?? false} /></>;
          },
        },

    ];
  };