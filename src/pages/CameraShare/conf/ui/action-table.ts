import { TActionContent, } from '@/models';

const actionTableConf: TActionContent | undefined = {"action":1,"displayName":"摄像头分享类别","idButtonAction":"kfGkU1-bhErFako761B33","idProject":"HUo86fGpkXtIrqPKvjct0","idSubProject":"8JTsJB_8DgDd9eb__CfYT","name":"CameraShareList","projectName":null,"subProjectName":"main","buttons":[{"label":"新增","clickEventName":"handleToAdd","disableScript":"!nodeTreeData","idButton":"3_13WIAgOmHve3m76HklW","buttonSize":"middle","type":"primary","showOrder":0,"nameScript":"'新增'"},{"label":"编辑","clickEventName":"handleToEdit","disableScript":"selectRows?.length !== 1","idButton":"6J7X95__8C1OzXqbKTrp9","buttonSize":"middle","type":"primary","showOrder":1,"nameScript":"'编辑'"},{"label":"单选","clickEventName":"handleRowSelectType","disableScript":"!nodeTreeData","hiddenScript":"rowSelectionType === 'radio'","idButton":"oKZO0RHHFWAYWRvsC7RMW","buttonSize":"middle","type":"primary","showOrder":2,"nameScript":"'单选'"},{"label":"多选","clickEventName":"handleRowSelectType","disableScript":"!nodeTreeData","hiddenScript":"rowSelectionType === 'checkbox'","idButton":"A20J1aDvpQHdVDlEeR_Xi","buttonSize":"middle","type":"primary","showOrder":3,"nameScript":"'多选'"},{"label":"删除","clickEventName":"handleRowsDelete","disableScript":"selectRows?.length == 0","idButton":"mSyqueRzvHx_WCb0IifhT","buttonSize":"middle","type":"primary","showOrder":4,"nameScript":"'删除'"},{"label":"启用","clickEventName":"handleEnabledChange","disableScript":"selectRows?.length !== 1","idButton":"M3V-JBmVeJoSsW3b0ZkG_","buttonSize":"middle","type":"primary","showOrder":5,"hiddenScript":"","nameScript":"(selectRows?.length === 1 && selectRows[0]['enabled'] === 0)?'启用':'禁用'"}],"gap":"10px","justifyContent":"start"};

export { actionTableConf }