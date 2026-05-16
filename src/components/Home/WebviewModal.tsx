import { StyleSheet, Text, View,Modal,TouchableOpacity,Image,
Platform,
 } from 'react-native'
import React from 'react'
import { Gesture, GestureDetector,GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { px } from '../../utils/scaleUtils';
import { scheduleOnRN } from 'react-native-worklets';

const WebviewModal=({visible,setVisible,uri,swipeRightGesture,title})=> {
  return (
        <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)} // iOS 下有效，安卓走上面的 BackHandler
      >
        <GestureDetector gesture={swipeRightGesture}>
       <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setVisible(false)}>
          <Image source={require('../../../assets/images/my/left.png')} 
          style={{width: px(22),height: px(22),}}></Image>
          </TouchableOpacity>
          <Text style={styles.titlee}>{title}</Text>
        </View>
        <WebView source={{ uri:uri}} style={{ flex: 1 }} 
  bounces={false}           // 禁止 iOS 边缘回弹
  scrollEnabled={true}      // 确保可滚动
  decelerationRate={Platform.OS === 'ios' ? 'normal' : 0.985} // iOS: 字符串, Android: 数字
  showsVerticalScrollIndicator={false} // 可选：隐藏右侧滚动条
        />
        </SafeAreaView>
        </SafeAreaProvider>
        </GestureDetector>
      </Modal>
  )
}
export default React.memo(WebviewModal);
const styles = StyleSheet.create({
              titlee: {
        flex: 1,
        textAlign: 'center',
         fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        //color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(24),
        marginRight: px(24),
      },
       header: {
        height: px(50),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: px(10),
        backgroundColor: '#fff',
        borderBottomWidth: px(1),
        borderBottomColor: '#ddd',
      },
})