import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  StyleSheet,
} from 'react-native';



 const Line=()=>{
    return (
    <View style={{width: '100%',height:StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}/>
    )
}
export default function AddonModal({
  visible,
  addonEditIndex,
  addonForm,
  setAddonForm,
  handleSaveAddon,
  setAddonModalVisible,
  styles,
  contextHolder
}) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // 关闭动画（延迟关闭Modal）
  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setAddonModalVisible(false);
    });
  };
  // 打开动画
  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 12,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {contextHolder}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalMask}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Animated.View
              style={[
                styles.modalBox,
                { 
                 transform: [{ scale: scaleAnim }],
                },
              ]}
            >

              <Text style={styles.modalTitle}>
                {addonEditIndex > -1 ? '编辑增值服务' : '添加增值服务'}
              </Text>



            <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
                justifyContent: 'space-between',
            }}>
            <View style={{}}>
            <Text style={styles.lefttitle}>内容
            <Text style={{color:'red'}}>*</Text>
            </Text>
            <Text style={styles.smalldes}>(限50个字符)</Text>
            </View>
             <TextInput
                style={styles.modalInput}
                placeholder="请输入内容"
                value={addonForm.content}
                maxLength={50}
                placeholderTextColor="#AAAAAA"
                onChangeText={(t) =>
                  setAddonForm({ ...addonForm, content: t })
                }
              />
            </View>
            <View style={{width: '100%',flexDirection: 'row',
                justifyContent: 'flex-end',}}>
            <Line />
            </View>

              {/* 内容 */}
             <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
                justifyContent: 'space-between',
            }}>
            <View style={{}}>
            <Text style={styles.lefttitle}>销售价
            <Text style={{color:'red'}}>*</Text>
            </Text>
            <Text style={styles.smalldes}>(实际支付价格)</Text>
            </View>
              <TextInput
                style={styles.modalInput}
                placeholder="请输入销售价"
                keyboardType="numeric"
                maxLength={8}
                placeholderTextColor="#AAAAAA"
                value={addonForm.price}
                onChangeText={(t) =>
                  setAddonForm({ ...addonForm, price: t })
                }
              />
            </View>
            <View style={{width: '100%',flexDirection: 'row',
                justifyContent: 'flex-end',}}>
            <Line />
            </View>

              {/* 价格 */}

             <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
                justifyContent: 'space-between',
            }}>
            <View style={{}}>
            <Text style={styles.lefttitle}>库存
            </Text>
            <Text style={styles.smalldes}>(不填默认为999)</Text>
            </View>
              <TextInput
                style={styles.modalInput}
                placeholder="请输入库存"
                keyboardType="numeric"
                maxLength={8}
                placeholderTextColor="#AAAAAA"
                value={addonForm.stock}
                onChangeText={(t) =>
                  setAddonForm({ ...addonForm, stock: t })
                }
              />
            </View>
            <View style={{width: '100%',flexDirection: 'row',
                justifyContent: 'flex-end',}}>
            <Line />
            </View>
              {/* 库存 */}
  

              {/* 保存 */}
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleSaveAddon}
              >
                <Text style={styles.confirmText}>
                  {addonEditIndex > -1 ? '保存修改' : '确认添加'}
                </Text>
              </TouchableOpacity>

              {/* 取消 */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleClose}
              >
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>

            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
} 