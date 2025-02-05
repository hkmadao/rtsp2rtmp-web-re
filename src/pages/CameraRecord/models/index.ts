import { TAudit } from '@/models';

/**摄像头记录 */
export type TCameraRecord = {
  /**记录id */
  idCameraRecord?: string;
  /**创建时间 */
  created?: string;
  /**临时文件名称 */
  tempFileName?: string;
  /**临时文件标志 */
  fgTemp?: boolean;
  /**文件名称 */
  fileName?: string;
  /**文件删除标志 */
  fgRemove?: boolean;
  /**文件时长 */
  duration?: number;
  /**开始时间 */
  startTime?: string;
  /**结束时间 */
  endTime?: string;
  /**是否有音频 */
  hasAudio?: boolean;
  /**摄像头 */
  camera?: TCamera;
  idCamera?: string;
} & TAudit;
/**摄像头 */
export type TCamera = {
  /**加密标志 */
  fgEncrypt?: boolean;
  /**在线状态 */
  onlineStatus?: boolean;
  /**保存录像状态 */
  saveVideo?: boolean;
  /**播放权限码 */
  playAuthCode?: string;
  /**编号 */
  code?: string;
  /**被动推送rtmp标志 */
  fgPassive?: boolean;
  /**摄像头类型 */
  cameraType?: string;
  /**rtmp识别码 */
  rtmpAuthCode?: string;
  /**rtmp推送地址 */
  rtmpUrl?: string;
  /**创建时间 */
  created?: string;
  /**rtmp推送状态 */
  rtmpPushStatus?: boolean;
  /**rtsp地址 */
  rtspUrl?: string;
  /**启用状态 */
  enabled?: boolean;
  /**摄像头主属性 */
  id?: string;
  /**直播状态 */
  live?: boolean;
} & TAudit;
