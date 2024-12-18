import { TAudit } from '@/models';

/**摄像头分享 */
export type TCameraShare = {
  /**摄像头分享主属性 */
  id?: string;
  /**名称 */
  name?: string;
  /**权限码 */
  authCode?: string;
  /**启用状态 */
  enabled?: boolean;
  /**创建时间 */
  created?: string;
  /**开始时间 */
  startTime?: string;
  /**结束时间 */
  deadline?: string;
  /**摄像头 */
  camera?: TCamera;
  cameraId?: string;
} & TAudit;
/**摄像头 */
export type TCamera = {
  /**在线状态 */
  onlineStatus?: boolean;
  /**保存录像状态 */
  saveVideo?: boolean;
  /**播放权限码 */
  playAuthCode?: string;
  /**code */
  code?: string;
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
