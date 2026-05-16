import React from 'react';
import { Modal, View, Alert, Platform, PermissionsAndroid,ActivityIndicator

 } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import FastImage from 'react-native-fast-image';




export default function ImagePreviewer({
  visible,
  images = [],
  index = 0,
  onClose,
  enableLongPressSave = true,
}) {
  // 转换格式
  const imageUrls = images.map((item) => ({
    url: item.uri || item.url,
  }));

  // ✅ 下载图片（你原来的逻辑融合）
  const handleDownloadImage = async (imageUrl) => {
  try {
    const isRemote = imageUrl.startsWith('http');

    let localPath = imageUrl;

    if (isRemote) {
      // 🌐 网络图片 → 下载
      const urlParts = imageUrl.split('.');
      let ext = urlParts[urlParts.length - 1];

      if (!['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext.toLowerCase())) {
        ext = 'png';
      }

      const dirs = ReactNativeBlobUtil.fs.dirs;

      const path = `${dirs.CacheDir}/${Date.now()}.${ext}`;

      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: ext,
        path,
      }).fetch('GET', imageUrl);

      localPath = res.path();
    } else {
      // 📱 本地图片（image-picker 拿到的）
      localPath = imageUrl.replace('file://', '');
    }

    // 📸 保存到相册
    const savedUri = await CameraRoll.save(
      Platform.OS === 'android'
        ? 'file://' + localPath
        : localPath,
      {
        type: 'photo',
        album: 'MyApp',
      }
    );

    Alert.alert('保存成功', '图片已保存到相册');
    console.log('保存成功:', savedUri);
  } catch (error) {
    console.log('保存失败:', error);
    Alert.alert('保存失败', '请检查权限或图片路径');
  }
};

  // ✅ 长按事件
  const handleLongPress = (image) => {
    const url = image?.url;

    Alert.alert('保存图片', '是否保存到相册？', [
      { text: '取消', style: 'cancel' },
      {
        text: '保存',
        onPress: () => handleDownloadImage(url),
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {visible && imageUrls.length > 0 && (
          <ImageViewer
            imageUrls={imageUrls}
            index={index}
            onClick={onClose}
            enableSwipeDown
            onSwipeDown={onClose}
            backgroundColor="black"
            useNativeDriver={false}
            doubleClickInterval={500}
            enablePreload={false}
            saveToLocalByLongPress={false}
            onLongPress={enableLongPressSave ? handleLongPress : undefined}
              loadingRender={() => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </View>
  )}
    failImageSource={{
    url: 'https://yourdomain.com/error-placeholder.png'
  }}
          />
        )}
      </View>
    </Modal>
  );
}