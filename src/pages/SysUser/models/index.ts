import { TAudit } from '@/models';

/**系统用户 */
export type TUser = {
  /**系统用户id */
  idUser?: string;
  /**登录账号  */
  account?: string;
  /**用户密码  */
  userPwd?: string;
  /**手机号码 */
  phone?: string;
  /**邮箱 */
  email?: string;
  /**姓名  */
  name?: string;
  /**昵称 */
  nickName?: string;
  /**性别 */
  gender?: string;
  /**启用标志 */
  fgActive?: boolean;
} & TAudit;
