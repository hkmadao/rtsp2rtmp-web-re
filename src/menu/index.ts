import { MenuDataItem } from '@ant-design/pro-layout';
import dynamicMenus from './dynamic-menus';

export type TAppInitial = {
  menus: MenuDataItem[];
};

const menus: MenuDataItem[] = [
  {
    path: '/welcome',
    name: '欢迎',
  },
  {
    path: '/dynamic',
    name: '动态调试路由',
    children: dynamicMenus,
  },
  {
    path: '/sys',
    name: '用户权限',
    children: [
      {
        path: '/sys/Menu',
        name: '系统菜单',
      },
      {
        path: '/sys/Roleagg',
        name: '角色聚合',
      },
      {
        path: '/sys/Useragg',
        name: '系统用户聚合',
      },
    ],
  },
];

export default menus;
