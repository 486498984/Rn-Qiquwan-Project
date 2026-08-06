import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { BDConvertNative } = NativeModules;

const BD_LAUNCH_REPORTED_KEY = 'BD_LAUNCH_REPORTED_KEY';
const BD_ACTIVE_REPORTED_KEY = 'BD_ACTIVE_REPORTED';

function isBDConvertAvailable() {
  if (Platform.OS !== 'android') {
    return false;
  }

  if (!BDConvertNative) {
    console.log('BDConvertNative 未注册');
    return false;
  }

  return true;
}

/**
 * 用户同意隐私政策后，发送启动事件
 *
 * 方式 B 必须调用这个。
 * 注意：sendLaunchEvent 只能调用一次。
 */
export async function sendBDLaunchEventOnce() {
  if (!isBDConvertAvailable()) {
    return false;
  }

  try {
    const hasReported = await AsyncStorage.getItem(BD_LAUNCH_REPORTED_KEY);

    if (hasReported) {
      console.log('BD 启动事件已经发送过，本次跳过');
      return true;
    }

    await BDConvertNative.sendLaunchEvent();
    await AsyncStorage.setItem(BD_LAUNCH_REPORTED_KEY, '1');

    console.log('BD 启动事件发送成功');
    return true;
  } catch (error) {
    console.log('BD 启动事件发送失败:', error);
    return false;
  }
}

/**
 * 上报 active，只上报一次
 */
export async function reportActiveOnce() {
  if (!isBDConvertAvailable()) {
    return false;
  }

  try {
    const hasReported = await AsyncStorage.getItem(BD_ACTIVE_REPORTED_KEY);

    if (hasReported) {
      console.log('active 已经上报过，本次跳过');
      return true;
    }

    await BDConvertNative.reportActive();
    await AsyncStorage.setItem(BD_ACTIVE_REPORTED_KEY, '1');

    console.log('active 上报成功');
    return true;
  } catch (error) {
    console.log('active 上报失败:', error);
    return false;
  }
}

/**
 * 用户同意隐私政策后推荐调用
 */
export async function initBDConvertAfterPrivacyAgree() {
  if (Platform.OS !== 'android') {
    return false;
  }

  // 方式 B 的 init 已经在 Android Application 做了
  // 这里只发送启动事件和自定义 active
  await sendBDLaunchEventOnce();
  await reportActiveOnce();

  return true;
}

/**
 * 上报 active_register
 */
export async function reportActiveRegister(
  method: string = 'phone',
  success: boolean = true
) {
  if (!isBDConvertAvailable()) {
    return false;
  }

  try {
    await BDConvertNative.reportRegister(String(method), Boolean(success));
    console.log('active_register 上报成功');
    return true;
  } catch (error) {
    console.log('active_register 上报失败:', error);
    return false;
  }
}

/**
 * 上报 active_pay
 */
export async function reportActivePay(options: {
  amount: number | string;
  currency?: string | number;
  paymentChannel?: string | number;
  contentId?: string | number;
  contentName?: string | number;
  success?: boolean;
}) {
  if (!isBDConvertAvailable()) {
    return false;
  }

  const {
    amount,
    currency = 'CNY',
    paymentChannel = 'wechat',
    contentId = '',
    contentName = '',
    success = true,
  } = options;

  try {
    await BDConvertNative.reportPay(
      Number(amount || 0),
      String(currency ?? 'CNY'),
      String(paymentChannel ?? 'wechat'),
      String(contentId ?? ''),
      String(contentName ?? ''),
      Boolean(success)
    );

    console.log('active_pay 上报成功');
    return true;
  } catch (error) {
    console.log('active_pay 上报失败:', error);
    return false;
  }
}

/**
 * 调试用：清除本地上报记录
 */
export async function resetBDConvertDebugState() {
    await AsyncStorage.removeItem(BD_LAUNCH_REPORTED_KEY);
    await AsyncStorage.removeItem(BD_ACTIVE_REPORTED_KEY);

  console.log('BDConvert 本地调试状态已清除');
}