// components/PrivacyModal.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Linking,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { px } from '../../utils/scaleUtils';
import useAuthStore from '../../utils/zustand'
import LinearGradient from 'react-native-linear-gradient';

interface PrivacyModalProps {
  privacyUrl: string;  // 隐私政策链接
  termsUrl: string;    // 用户协议链接
  onAgree?: () => void;
}

const PrivacyModal = ({ privacyUrl, termsUrl, onAgree,showPrivacyModal,
    ondisAgree,sanfangUrl }) => {
  const handleAgree = async () => { //同意授权
    try {
      await AsyncStorage.setItem('privacyAgreed', 'true');
      useAuthStore.getState().setPrivacyAgreed(true)
      onAgree?.();
    } catch (e) {
      console.log('保存隐私协议状态失败', e);
    }
  };

  const handleDisagree = () => {  //拒绝授权
    ondisAgree?.()
    // if (Platform.OS === 'android') {
    //   BackHandler.exitApp();
    // } else {
    //   alert('您未同意隐私政策，App 将无法使用，请手动退出。');
    // }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      //alert('无法打开链接');
    });
  };

  return (
    <Modal statusBarTranslucent  visible={showPrivacyModal} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={styles.container}>
              <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
                justifyContent: 'center',marginTop: px(18),}}>
            <Text style={styles.title}>个人信息保护提示</Text>
            </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScroll} 
          contentContainerStyle={{paddingBottom: px(10)}}>
            <Text style={styles.content}>
              请您使用前充分阅读并理解<Text style={styles.link} onPress={() => openLink(termsUrl)}>《用户协议》</Text>和<Text style={styles.link} onPress={() => openLink(privacyUrl)}>《隐私政策》</Text>，其中将明确介绍在使用中我们收集、处理您个人信息的情况。
              需要使用的个人信息说明如下:
              {'\n'}
1、当您点击[同意]按钮之后，在使用本应用或应用在后台运行时，我们会收集您设备信息(包括IMEI、IDFA(仅iOS端)Android ID(仅安卓端)、MAC地址、OAID、IMSI、ICCID、BSSID、SN号码、MCC+MNC、设备型号)、IP地址、访问日期和时间、网络日志信息、WIFI网络信息（SSID）、传感器信息、应用列表、应用包名及版本用于标识唯一用户、保障网络访问稳定性、数据统计及定向推送。
{'\n'}
2、设备信息:我们会获取设备信息，用于区分设备及进行消息推送和基础数据统计，该信息不会用于识别您的个人真实身份或用于与本应用功能无关的用途。
         {'\n'}   
           3、存储空间:为缓存应用运行所需的必要数据、上传、提升加载效率，我们可能会访问设备存储空间，该权限不会用于访问与应用功能无关的个人文件。  
             {'\n'}  
              4、位置信息:为了向用户提供实时天气查询服务，本应用需要获取您的位置权限，我们会请求您授权位置权限。
         {'\n'}
              5、在使用过程中我们会根据实际场景申请位置信息、摄像头、相册等权限。
{'\n'}
              6、本应用接入的第三方 SDK 服务，会在获得授权后收集必要的权限(IMEI、IMSI、MAC地址、软件安装列表、SIM卡信息、IP信息等)，具体信息类型、使用目的及方式详见<Text style={styles.link} onPress={() => openLink(sanfangUrl)}>《第三方信息共享清单》</Text>。
                  {'\n'}
                    7、您可以通过本应用提供的方式申请注销账户。账户注销完成后，我们将停止向您提供产品或服务，并在法律法规允许的范围内，对您的个人信息进行删除或匿名化处理。

            </Text>
          </ScrollView>

          <View style={styles.buttonRow}>
       

            <TouchableOpacity onPress={handleAgree}>
             <LinearGradient
            colors={['#FEC525', '#FC9026']} // 渐变颜色
            start={{ x: 1, y: 0 }}   
            end={{ x: 0, y: 0 }}
            style={styles.gradientBox}
            >
                <View style={{flexDirection: 'row',alignItems: 'center',
                    justifyContent: 'center',
                }}>
            <Text style={styles.logintext}>同意</Text>
            </View>
            </LinearGradient>
            </TouchableOpacity>
                 <TouchableOpacity  onPress={handleDisagree}
                 style={{width: '100%',flexDirection: 'row',justifyContent: 'center',
                    marginTop: px(18),
                 }}>
              <Text style={styles.buttonText}>不同意</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(PrivacyModal);

const styles = StyleSheet.create({
            logintext:{
        fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(24),
    },
    gradientBox: {
    width:px(221),
    height: px(48),
    borderRadius: px(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: px(321),
    height: px(513),
    backgroundColor: '#fff',
    borderRadius: px(16),
    //paddingTop:px(20),
    paddingHorizontal:px(25),
    paddingBottom:px(18),
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius:px(10),
    elevation: 10,
    //maxHeight: '70%',
  },
  title: { 
    textAlign: 'center',
    fontFamily: 'MiSans-Medium',
    fontSize:px(20),
    color:'#1A1A1A',
    //fontWeight:500,
    lineHeight:px(29),
},
  contentScroll: { 
    marginTop: px(12),
    width: px(271),
    height: px(242),
    //paddingVertical:px(14),
},
  content: { 
    fontFamily: 'MiSans-Regular',
    fontSize:px(15),
    color:'#767676',
    fontWeight:400,
    lineHeight:px(26), 
 },
  link: { 
    color: '#C85541', textDecorationLine: 'underline' 
},
  buttonRow: { 
    //backgroundColor: 'red',
    marginTop: px(18),
    flexDirection: 'column',
    alignItems: 'center',
},
  agreeButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:px(26) ,
    width: px(204),
    height: px(52),
    backgroundColor: '#C85541' 
},
arggbuttonText:{
   fontFamily: 'MiSans-Medium',
    fontSize:px(16),
    color:'#FFFFFF',
    //fontWeight:400,
    lineHeight:px(21), 
},
  buttonText: {    
    //marginTop: px(18),
    fontFamily: 'MiSans-Regular',
    fontSize:px(18),
    color:'#767676',
    fontWeight:400,
    lineHeight:px(24), 
},
});
