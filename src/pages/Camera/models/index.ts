import { TAudit } from '@/models';

/**摄像头 */
export type TCamera = {
  /**摄像头主属性 */
  id?: string;
  /**编号 */
  code?: string;
  /**rtsp地址 */
  rtspUrl?: string;
  /**rtmp推送地址 */
  rtmpUrl?: string;
  /**播放权限码 */
  playAuthCode?: string;
  /**在线状态 */
  onlineStatus?: boolean;
  /**启用状态 */
  enabled?: boolean;
  /**rtmp推送状态 */
  rtmpPushStatus?: boolean;
  /**保存录像状态 */
  saveVideo?: boolean;
  /**直播状态 */
  live?: boolean;
  /**创建时间 */
  created?: string;
  /**摄像头 */
  cameraShares?: TCameraShare;
} & TAudit;
/**摄像头分享 */
export type TCameraShare = {
  /**权限码 */
  authCode?: string;
  /**名称 */
  name?: string;
  /**启用状态 */
  enabled?: boolean;
  /**开始时间 */
  startTime?: string;
  /**创建时间 */
  created?: string;
  /**摄像头分享主属性 */
  id?: string;
  /**结束时间 */
  deadline?: string;
} & TAudit;
