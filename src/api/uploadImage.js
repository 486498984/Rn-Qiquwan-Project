import md5 from './md5';
import { BASE_URL } from './config';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 生成5位随机数
function generateRandomFiveDigitNumber() {
  const randomNumber = Math.floor(Math.random() * 100000);
  return String(randomNumber).padStart(5, '0');
}

// 上传图片（支持单张 / 多张）
export async function uploadImage(imageUris: string | string[]) {
  try {
    const userInfoString = await AsyncStorage.getItem('userinfo');

    // 修正默认值结构
    const fixeduserinfo = { appKey: 1, appId: 1 };

    const storageClassList = userInfoString
      ? JSON.parse(userInfoString)
      : fixeduserinfo;

    const appKey = storageClassList.appKey;
    const appid = storageClassList.appId;

    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const numer = generateRandomFiveDigitNumber();

    // 签名
    const thickenurl = `nonce=${numer}&timestamp=${timestampInSeconds}&appkey=${appKey}`;
    const sign = md5(thickenurl);

    const splicingurl = `?nonce=${numer}&timestamp=${timestampInSeconds}&sign=${sign}`;

    // 统一转数组
    const files = Array.isArray(imageUris) ? imageUris : [imageUris];

    // 构造 FormData
    const formData = new FormData();

    files.forEach((uri, index) => {
    formData.append('img', {
    uri,
    type: 'image/jpeg',
    name: `upload_${index}.jpg`,
    });
    });

    const response = await fetch(`${BASE_URL}/upload/image${splicingurl}`, {
      method: 'POST',
      headers: {
        appid: String(appid),
        // ⚠️ 不要手动写 Content-Type
      },
      body: formData,
    });

    const result = await response.json();

    if (result.Code === 0) {
      return result;
    } else if (result.Code === 401) {
      Alert.alert('提示', '登录已过期');
      throw new Error('登录已过期');
    } else if (result.Code === 2000) {
      Alert.alert('提示', '网络错误请重试');
      throw new Error('请求失败');
    } else {
      return result;
    }
  } catch (error) {
    console.log(error);
    Alert.alert('错误', '服务器连接异常，请检查网络再试');
    throw error;
  }
}