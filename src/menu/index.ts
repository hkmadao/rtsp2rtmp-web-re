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
    path: '/live',
    name: '直播管理',
    children: [
      {
        "path": "/live/Camera",
        "name": "摄像头"
      },
      {
        "path": "/live/CameraShare",
        "name": "摄像头分享"
      },
      {
        "path": "/live/CameraRecord",
        "name": "摄像头记录"
      },
      {
        "path": "/Vod",
        "name": "视频文件",
      },
    ]
  },
  {
    path: '/sys',
    name: '系统管理',
    children: [
      {
        "path": "/sys/SysUser",
        "name": "系统用户"
      },
      {
        "path": "/sys/SysToken",
        "name": "令牌"
      },
    ],
  },
];

export default menus;
