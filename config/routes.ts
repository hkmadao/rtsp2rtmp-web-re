import dynamicRoutes from './dynamic-routes';

export default [
  {
    path: '/login',
    name: '登录',
    component: '@/pages/Login',
  },
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      ...dynamicRoutes,
      {
        path: 'welcome',
        name: '欢迎页',
        component: '@/pages/Welcome',
        exact: true,
      },
      {
        "path": "live/Camera",
        "name": "摄像头",
        "component": "@/pages/Camera",
        "exact": true
      },
      {
        "path": "live/CameraShare",
        "name": "摄像头分享",
        "component": "@/pages/CameraShare",
        "exact": true
      },
      {
        "path": "sys/SysUser",
        "name": "系统用户",
        "component": "@/pages/SysUser",
        "exact": true
      },
      {
        "path": "sys/SysToken",
        "name": "令牌",
        "component": "@/pages/SysToken",
        "exact": true
      },
    ],
  },
];
