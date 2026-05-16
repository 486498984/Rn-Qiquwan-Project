import { Dimensions } from 'react-native';

// 设计稿基准宽度（根据设计稿修改）
const UI_WIDTH_PX = 393; 

// 获取设备屏幕宽度（单位：dp）
const screenWidthDp = Dimensions.get('window').width; 

/**
 * 将设计稿像素值转换为设备独立像素（dp）
 * @param {number} uiPx 设计稿中的像素值
 * @returns {number} 转换后的dp值
 */
export const px = (uiPx) => {
  return (uiPx * screenWidthDp) / UI_WIDTH_PX;
};