import  md5  from './md5'; // 需要自行引入MD5库
import { BASE_URL } from './config';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../utils/zustand';
import Storage from '../utils/storage';
import { Toast } from '@ant-design/react-native'
//const loginChanged = useAuthStore(state => state.loginChanged);
// 生成5位随机数
function generateRandomFiveDigitNumber() {
  const randomNumber = Math.floor(Math.random() * 100000);
  return String(randomNumber).padStart(5, '0');
}

// 对象转查询字符串
function objectToQueryString(obj) {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

// 主请求函数
export default async function request(obj) {

  try {
    const {
      data = {},
      query = {},
      contentType = 'application/json',
      method = 'GET',
      url,
    } = obj;

    // 获取存储的用户信息
    const userInfoString = await AsyncStorage.getItem('userinfo');
    //console.log(JSON.parse(userInfoString).data.appKey);
    var fixeduserinfo={data:{appKey:1,appId:1}}
    const storageClassList = userInfoString ? JSON.parse(userInfoString) : fixeduserinfo;
    const appKey = storageClassList.appKey;
    const appid = storageClassList.appId;
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const numer = generateRandomFiveDigitNumber();
    // 签名生成逻辑
    let thickenurl = `nonce=${numer}&timestamp=${timestampInSeconds}&appkey=${appKey}`;
    let params = { nonce: numer, timestamp: timestampInSeconds };
    if (Object.keys(query).length !== 0) {
      params = { ...params, ...query };
    }

    const sortedKeys = Object.keys(params).sort();
    const sortedParams = sortedKeys
      .map(key => `${key}=${params[key]}`)
      .join('&') + `&appkey=${appKey}`;

    let sign = md5(sortedParams);
    if (Object.keys(query).length === 0) {
      sign = md5(thickenurl);
    }

    // 构建请求URL
    let splicingurl = `?nonce=${numer}&timestamp=${timestampInSeconds}&sign=${sign}`;

    if (Object.keys(query).length !== 0) {
      const sortedQueryKeys = Object.keys(query).sort();
      const sortedQueryParams = sortedQueryKeys
        .map(key => `${key}=${encodeURIComponent(query[key])}`)
        .join('&');
      splicingurl += `&${sortedQueryParams}`;
    }
    // 执行请求
    const response = await fetch(`${BASE_URL}${url}${splicingurl}`, {
      method,
      headers: {
        'Content-Type': contentType,
        'appid': appid,
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
    });
     
    const result = await response.json();
    console.log(result);
    
    // 响应处理
    if (result.code === 0) {
      return result;
    } else if (result.code === 402) {
      Toast.info({content:'当前账号已经在其他设备登陆',mask:false});
      await Storage.remove('userinfo');
      useAuthStore.getState().loginChanged();
      //Alert.alert('提示', '登录已过期');
      // 跳转到登录页
      // navigation.navigate('Login');
      //throw new Error('登录已过期');
    } else if (result.code === 2000) {
      //Alert.alert('提示', '网络错误请重试');
      //throw new Error('请求失败');
    } else {
      return result;
    }
  } catch (error) {
    //console.log('wwww',obj);
    
    //Alert.alert('错误', '服务器连接异常，请检查网络再试');
    throw error;
  }
}
