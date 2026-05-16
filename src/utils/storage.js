// storage.js

// import Storage from './storage';   使用方法

// // 保存
// await Storage.set('user', { name: 'Tom', age: 18 });

// // 读取
// const user = await Storage.get('user');
// console.log(user); // { name: 'Tom', age: 18 }

// // 删除
// await Storage.remove('user');

// // 清空
// await Storage.clear();

// // 获取所有 key
// const keys = await Storage.getAllKeys();
// console.log(keys);

import AsyncStorage from '@react-native-async-storage/async-storage';
const HISTORY_KEY = 'browse_history';
const CITY_KEY = 'city_list'; // 城市存储的 key
class Storage {
  /**
   * 保存数据
   * @param {string} key 
   * @param {any} value  可以是 string / object / array
   */
  static async set(key, value) {
    try {
      const strValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, strValue);
    } catch (e) {
      console.warn(`存储失败 [${key}]`, e);
    }
  }

  /**
   * 获取数据
   * @param {string} key 
   * @param {any} defaultValue 默认值（没取到时返回）
   * @returns {Promise<any>}
   */
  static async get(key, defaultValue = null) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value == null) return defaultValue;

      // 如果是 JSON 字符串，尝试 parse
      try {
        return JSON.parse(value);
      } catch {
        return value; // 普通字符串
      }
    } catch (e) {
      console.warn(`读取失败 [${key}]`, e);
      return defaultValue;
    }
  }

  /**
   * 删除某个 key
   * @param {string} key 
   */
  static async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`删除失败 [${key}]`, e);
    }
  }

  /**
   * 清空所有缓存
   */
  static async clear() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn('清空缓存失败', e);
    }
  }

/**
 * 清空除 privacyAgreed、city_list 之外的缓存
 */
static async clearExceptPrivacy() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const keysToDelete = keys.filter(
      key => key !== 'privacyAgreed' && key !== 'city_list' && key !== 'notice'
      && key !== 'canlendarmode'
    );

    if (keysToDelete.length > 0) {
      await AsyncStorage.multiRemove(keysToDelete);
    }
  } catch (e) {
    console.warn('清空缓存失败', e);
  }
}

  /**
   * 获取所有 key
   */
  static async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (e) {
      console.warn('获取 keys 失败', e);
      return [];
    }
  }


}

export default Storage;
