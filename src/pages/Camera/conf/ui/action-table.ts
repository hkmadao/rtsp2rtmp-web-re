import { TActionContent } from '@/models';

const actionTableConf: TActionContent | undefined = {
  action: 1,
  displayName: '摄像头列表',
  idButtonAction: 'fUrZesqSxEjQP-cSP9PYX',
  idProject: 'HUo86fGpkXtIrqPKvjct0',
  idSubProject: '8JTsJB_8DgDd9eb__CfYT',
  name: 'CameraList',
  projectName: null,
  subProjectName: 'main',
  buttons: [
    {
      label: '新增',
      clickEventName: 'handleToAdd',
      disableScript: '',
      idButton: '2B6Bl37AwjXc5uy8RKh4n',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 0,
      nameScript: "'新增'",
    },
    {
      label: '编辑',
      clickEventName: 'handleToEdit',
      disableScript: 'selectRows?.length !== 1',
      idButton: 'sFQGoEuC4ZYrqpFZMyJOF',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 1,
      nameScript: "'编辑'",
    },
    {
      label: '单选',
      clickEventName: 'handleRowSelectType',
      disableScript: '',
      hiddenScript: "rowSelectionType === 'radio'",
      idButton: '9aJkAwH9H-S_kF_zZRFZ8',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 2,
      nameScript: "'单选'",
    },
    {
      label: '多选',
      clickEventName: 'handleRowSelectType',
      disableScript: '',
      hiddenScript: "rowSelectionType === 'checkbox'",
      idButton: '-72lBOPZZUfn0trfZbhFf',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 3,
      nameScript: "'多选'",
    },
    {
      label: '删除',
      clickEventName: 'handleRowsDelete',
      disableScript: 'selectRows?.length == 0',
      idButton: 'KNx8mvHnXJOSlyH-24vBN',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 4,
      nameScript: "'删除'",
    },
    {
      label: '启用',
      clickEventName: 'handleEnableChange',
      disableScript: 'selectRows?.length !== 1',
      hiddenScript: '',
      idButton: '7NUDFmk8mf9PXV5iROmV_',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 5,
      nameScript:
        "(selectRows?.length === 1 && selectRows[0]['enabled'] === false)?'启用':'禁用'",
    },
    {
      label: '开启直播',
      clickEventName: 'handleLiveChange',
      disableScript: 'selectRows?.length !== 1',
      hiddenScript: '',
      idButton: 'K7T7J1dW_QAFInu6H9HNg',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 6,
      nameScript:
        "(selectRows?.length === 1 && selectRows[0]['live'] === false)?'开启直播':'停止直播'",
    },
    {
      label: '开启录像',
      clickEventName: 'handleSaveVideoChange',
      disableScript: 'selectRows?.length !== 1',
      hiddenScript: '',
      idButton: 'PUkiKvnRL62hcwTjLhXC8',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 7,
      nameScript:
        "(selectRows?.length === 1 && selectRows[0]['saveVideo'] === false)?'开启录像':'停止录像'",
    },
    {
      label: '开启Rtmp推送',
      clickEventName: 'handleRtmpPushStatusChange',
      disableScript: 'selectRows?.length !== 1',
      hiddenScript: '',
      idButton: 'LxEZUlJlWO8hp40V3g4rI',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 8,
      nameScript:
        "(selectRows?.length === 1 && selectRows[0]['rtmpPushStatus'] === false)?'开启Rtmp推送':'停止Rtmp推送'",
    },
    {
      label: '刷新播放权限码',
      clickEventName: 'handlePlayAuthreFresh',
      disableScript: 'selectRows?.length !== 1',
      hiddenScript: '',
      idButton: 'v7RmaiF5MH6E-W0czwHtl',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 9,
      nameScript: "'刷新播放权限码'",
    },
  ],
  gap: '10px',
  justifyContent: 'start',
};

export { actionTableConf };
