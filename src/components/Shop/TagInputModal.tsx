import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomModal from '../My/BottomModal';
import { px } from '../../utils/scaleUtils';
import { Toast } from '@ant-design/react-native';



type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (list: string[]) => void;
  defaultValue?: string[];
  title?: string;
};

export default function TagInputModal({
  visible,
  onClose,
  onConfirm,
  defaultValue = [],
  title = '请输入',
}: Props) {
  const [text, setText] = useState('');
  const [list, setList] = useState<string[]>(defaultValue);
  const [toastApi, contextHolder] = Toast.useToast();
  // 添加标签
  const handleAdd = () => {
    //Keyboard.dismiss();
    const value = text.trim();
    if (!value){
    // Alert.alert("请先输入内容");
    toastApi.show({
    content: '请先输入内容',
    duration: 2,
    position: 'top',
    mask: false,
   });
   return;
    } 
    if(list.length>3){
     toastApi.show({
    content: '不能超过4个',
    duration: 2,
    position: 'top',
    mask: false,
  });
      return
    }
    // 防重复
    if (list.includes(value)) {
      setText('');
      return;
    }

    setList(prev => [...prev, value]); // 保持顺序
    setText('');
  };

  // 删除标签
  const handleDelete = (index: number) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  // 确认
  const handleConfirm = () => {
    onConfirm(list);
    onClose();
  };
  useEffect(() => {
  if (visible) {
    // 打开 → 用外部值初始化
    setList(defaultValue || []);
    setText('');
  }
}, [visible, defaultValue]);
 const closee = () => { 
  Keyboard.dismiss();
  };
  const handleClose = () => {
  setList(defaultValue || []); // 👈 还原
  setText('');
  onClose();
};
  return (

    <BottomModal visible={visible} onClose={()=>closee()}>
  {contextHolder}
      <View style={{ padding: px(16) }}>

        {/* 标题 */}
             <View style={{
               flexDirection: 'row',
               justifyContent: 'center',
               alignItems: 'center'
               }}>
               <Text style={styles.modaltitle}>
                 {title}({list.length}
                 <Text style={{color:'#AAAAAA'}}>/4)</Text>
               </Text>
     
               <TouchableOpacity
                 style={{ position: 'absolute', right:-px(16),
                  width:px(62),height:px(42),flexDirection: 'row',alignItems: 'center',
                  justifyContent: 'flex-end',paddingRight:px(16)
                  }}
                 onPress={handleClose}
                 >
                  <Image source={require('../../../assets/images/my/close.png')} 
                  style={{width:px(16),height:px(16)}}></Image>
               </TouchableOpacity>
             </View>

        {/* 输入区域 */}
        <View style={styles.inputRow}>
        <View style={styles.inputbox}>
        <Image source={require('../../../assets/images/my/edit.png')} 
            style={{width:px(19),height:px(19),marginTop: px(0),}}></Image>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="请输入"
            style={styles.input}
            maxLength={6}
            placeholderTextColor="#999"
          />
          <View style={{flexDirection: 'row',alignItems: 'center',}}>
            <Text style={styles.txnumber}>{text.length}</Text>
            <Text style={[styles.txnumber,{color:'#AAAAAA'}]}>/6</Text>
          </View>
        </View>


          <TouchableOpacity onPress={handleAdd}>
            <View
              style={styles.addBtn}
            >
              <Text style={styles.addText}>添加</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 标签列表 */}
        <View style={styles.tagWrap}>
          {list.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.tag}>
              <Text style={styles.tagText}>{item}</Text>

              <TouchableOpacity onPress={() => handleDelete(index)}>
                 <Image source={require('../../../assets/images/my/tagclose.png')} 
            style={{width:px(15),height:px(15),marginTop: px(0),}}></Image>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* 底部按钮 */}
        <TouchableOpacity onPress={handleConfirm} style={{width: '100%',flexDirection: 'row',alignItems: 'center',
            justifyContent: 'center',
        }}>
          <LinearGradient
            colors={['#FEC525', '#FC9026']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.confirmBtn}
          >
            <Text style={styles.confirmText}>确定</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
      
    </BottomModal>

  );
}

const styles = StyleSheet.create({
    txnumber:{
    fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(16),
    },
      modaltitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },
  title: {
    fontSize: px(16),
    fontWeight: '600',
    marginBottom: px(12),
    color: '#1A1A1A',
  },

  inputRow: {
    marginTop: px(18),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: px(16),
  },
   inputbox:{
    paddingHorizontal:px(8),
    width: px(286),
    backgroundColor: '#F7F8FC',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: px(8),
   },
  input: {
    flex: 1,
    //backgroundColor: '#F7F8FC',
    height: px(43),
    paddingHorizontal: px(0),
    fontSize: px(14),
  },

  addBtn: {
    backgroundColor: '#FF9500',
    width: px(67),
    height: px(43),
    marginLeft: px(8),
    borderRadius: px(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addText: {
       fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(19),
  },

  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: px(16),
  },

  tag: {
    gap:px(6),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF7E0',
    //paddingHorizontal: px(10),
    paddingLeft:px(12),
    paddingRight:px(6),
    paddingVertical: px(6),
    borderRadius: px(4),
    marginRight: px(8),
    marginBottom: px(8),
  },

  tagText: {
       fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(15),
  },

  delete: {
    marginLeft: px(6),
    fontSize: px(16),
    color: '#999',
  },

  confirmBtn: {
    width: px(242),
    height: px(38),
    borderRadius: px(21),
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmText: {
       fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(20),
  },
});