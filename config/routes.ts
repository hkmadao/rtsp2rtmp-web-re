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
        path: 'sys/Menu',
        name: '系统菜单',
        component: '@/pages/Menu',
        exact: true,
      },
      {
        path: 'sys/Roleagg',
        name: '角色聚合',
        component: '@/pages/Roleagg',
        exact: true,
      },
      {
        path: 'sys/Useragg',
        name: '系统用户聚合',
        component: '@/pages/Useragg',
        exact: true,
      },
      {
        path: '*',
        component: '@/pages/P404',
      },
    ],
  },
];
