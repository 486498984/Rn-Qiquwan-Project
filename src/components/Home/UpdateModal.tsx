import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

export default function UpdateModal({ visible, apkUrl, onClose,updateways,updatename,updateContent }) {
  
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (visible) {
      setProgress(0);
      setDownloading(false);
    }
  }, [visible]);

  const startDownload = () => {
    setDownloading(true);
    downloadApk(apkUrl);
  };

const downloadApk = async () => {

  const dirs = ReactNativeBlobUtil.fs.dirs;
  const fileName = "app.apk";
  const savePath = `${dirs.DownloadDir}/${fileName}`;

  setDownloading(true);
  setProgress(0);

  ReactNativeBlobUtil.config({
    path: savePath,     // 用于支持精准进度
    fileCache: true,
  })
    .fetch('GET', apkUrl)
    .progress({ interval: 200 }, (received, total) => {
      const p = Math.floor((received / total) * 100);
      setProgress(p);
    })
    .then((res) => {
      console.log("下载成功：", res.path());

      // ⭐ 手动触发系统通知（让用户知道下载完了）
      ReactNativeBlobUtil.android.addCompleteDownload({
        title: "点击安装新版本",
        description: "点击安装新版本",
        mime: 'application/vnd.android.package-archive',
        path: res.path(),
        showNotification: true,
      });

      // ⭐ 自动调起安装界面
      ReactNativeBlobUtil.android.actionViewIntent(
        res.path(),
        'application/vnd.android.package-archive'
      );
      onClose();
    })
    .catch((err) => {
      console.log("下载失败：", err);
    });
};
 

  const installApk = (apkPath) => {
    console.log(apkPath);
    
    ReactNativeBlobUtil.android.actionViewIntent(
      apkPath,
      'application/vnd.android.package-archive'
    );
  };

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.mask}>
        <View style={styles.box}>
          <Text style={styles.title}>发现新版本 V{updatename}</Text>

          {!downloading ? (
            <>
              <Text style={styles.msg}>{updateContent}</Text>

              <View style={styles.row}>
                {updateways==0&&
                    <TouchableOpacity style={styles.cancel} onPress={onClose}>
                  <Text style={styles.cancelText}>下次再说</Text>
                </TouchableOpacity>
                }
                <TouchableOpacity style={styles.ok} onPress={startDownload}>
                  <Text style={styles.okText}>立即升级</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator color="#000" />
              <Text style={{ marginTop: 10 }}>下载中 {progress}%</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 280,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    //textAlign: 'center',
  },
  msg: {
    marginTop: 15,
    fontSize: 15,
    //textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginTop: 25,
    justifyContent: 'space-between',
  },
  cancel: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  cancelText: {
    textAlign: 'center',
  },
  ok: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FC9026',
    borderRadius: 5,
  },
  okText: {
    color: '#fff',
    textAlign: 'center',
  },
});
