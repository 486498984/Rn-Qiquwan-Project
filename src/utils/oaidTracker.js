import { NativeModules } from 'react-native';
import request from '../api/request';

const { OaidModule } = NativeModules;

/**
 * 判断 OAID 是否有效
 */
export const isValidOaid = (oaid) => {
  if (!oaid || typeof oaid !== 'string') return false;

  const value = oaid.trim();

  // 过滤中文
  if (/[\u4e00-\u9fa5]/.test(value)) return false;

  // 只允许字母数字-
  if (!/^[a-zA-Z0-9\-]+$/.test(value)) return false;

  // 提取数字
  const digits = value.replace(/\D/g, '');

  // 全0过滤
  if (!digits || /^0+$/.test(digits)) return false;

  return true;
};

/**
 * 上报接口
 */
const adactivate = async (oaid) => {
  try {
    const response = await request({
      url: '/ad/activate',
      method: 'POST',
      query: {
        oaid,
      },
    });
 
    console.log('adactivate response:', response);
    return response;
  } catch (error) {
    console.error('adactivate error:', error);
  }
};
 
/**
 * 核心方法：每次调用都上报
 */
export const trackOAID = async () => {
  try {
    console.log('track OAID start');

    // 1. 初始化 SDK
    await OaidModule.init();

    // 2. 获取 OAID
    const oaid = await OaidModule.getOAID();

    console.log('current oaid:', oaid);

    // 3. 校验 OAID
    if (!isValidOaid(oaid)) {
      console.log('invalid oaid, skip request');
      return null;
    }

    // 4. 每次都上报
    await adactivate(oaid);

    return oaid;
  } catch (error) {
    console.error('trackOAID error:', error);
    return null;
  }
};