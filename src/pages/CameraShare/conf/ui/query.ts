import { TQueryContent } from '@/models';

const queryConf: TQueryContent | undefined = {"action":1,"componentModuleName":"主模块","componentName":null,"displayName":"摄像头分享","idComponent":"xSyNLgN79BBw_9Doywr5K","idComponentModule":"54dAchFyvvdIbz37X1mI-","idProject":"HUo86fGpkXtIrqPKvjct0","idQuery":"tZIlEOucfI91bP3FSh5XH","idSubProject":"8JTsJB_8DgDd9eb__CfYT","name":"camerashare-query","projectName":"rtsp2rtmp","subProjectName":"main","searchRefs":[{"idBillSearchRef":"u3HGATXeMrXORSk7ztE2w","operatorCode":"like","label":"名称","attributeName":"name","searchAttributes":["name","authCode"],"htmlInputType":"Input","valueType":"String","defaultValue":"","showOrder":0},{"idBillSearchRef":"duf3QEe8MchgM01XDBReQ","operatorCode":"equal","label":"启用状态","attributeName":"enabled","searchAttributes":["enabled"],"htmlInputType":"Select","valueType":"Bool","defaultValue":"all","enumConfig":{"idEnumRef":"WuPCQr2IG4QKti0XamYeO","enumColumns":[{"idEnumColumn":"W6dkEboSFfLZZYe2MEzsu","displayName":"全部","enumValue":"all","code":"all"},{"idEnumColumn":"IMOc9L8G6EHLwVkStHXsg","displayName":"是","enumValue":"true","code":"true"},{"idEnumColumn":"HNwC7Vvnc_bEmElsrwsly","displayName":"否","enumValue":"false","code":"false"}]},"showOrder":1},{"idBillSearchRef":"fZKXO0kMR-_9z0yzqPZyr","operatorCode":"equal","label":"摄像头","attributeName":"cameraId","searchAttributes":["camera"],"htmlInputType":"Ref","valueType":"String","defaultValue":"","refConfig":{"refStyle":"table","title":"摄像头","displayProp":"code","backWriteProp":"id","tableRef":{"dataUri":"/camera/aqPage","tableMainProp":"id","idComponentEntity":"wQyvqDAI7C76VoDsAJZ8z","ceDisplayName":"摄像头","refColumns":[{"idBillRefColumn":"8scr-xonuWrzjJJmX44Qs","name":"code","displayName":"编号"},{"idBillRefColumn":"CIl3NTw90mas2e195gIcO","name":"rtspUrl","displayName":"rtsp地址"}]}},"showOrder":2,"refAttributeName":"camera"},{"idBillSearchRef":"7wnxIjMWJ-apc5VsRaxir","operatorCode":"greaterThan","label":"开始时间大于","attributeName":"startTimeGT","searchAttributes":["startTime"],"htmlInputType":"DateTime","valueType":"String","defaultValue":"","showOrder":3},{"idBillSearchRef":"ZBq4DN7prQNBqWTOP9yli","operatorCode":"lessThan","label":"开始时间小于","attributeName":"startTimeLT","searchAttributes":["startTime"],"htmlInputType":"DateTime","valueType":"String","defaultValue":"","showOrder":4}]};

export { queryConf }