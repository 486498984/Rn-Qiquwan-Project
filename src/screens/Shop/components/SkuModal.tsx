import React, { useEffect, useRef } from 'react';
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
  StyleSheet
} from 'react-native';
import { px } from '../../../utils/scaleUtils';
import { Toast } from '@ant-design/react-native';

 const Line=()=>{
    return (
    <View style={{width: '100%',height:StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}/>
    )
}
export default function SkuModal({
  visible,
  editIndex,
  skuForm,
  setSkuForm,
  handleSaveSku,
  setSkuModalVisible,
  styles,
  contextHolder
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
 
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

  // 关闭动画（延迟关闭Modal）
  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setSkuModalVisible(false);
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      {contextHolder}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalMask}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >

            {/* ⭐ 动画层 */}
            <Animated.View
              style={[
                styles.modalBox,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >

              <Text style={styles.modalTitle}>
                {editIndex > -1 ? '编辑套餐' : '添加套餐'}
              </Text>



            <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
                justifyContent: 'space-between',
            }}>
            <View style={{}}>
            <Text style={styles.lefttitle}>标题
            <Text style={{color:'red'}}>*</Text>
            </Text>
            <Text style={styles.smalldes}>(限30个字符)</Text>
            </View>
              <TextInput
                style={styles.modalInput}
                placeholder="请输入标题"
                value={skuForm?.title ?? ''}
                maxLength={30}
                placeholderTextColor="#AAAAAA"
                onChangeText={(t) =>
                setSkuForm({ ...skuForm, title: t })
                }
              />
            </View>
            <View style={{width: '100%',flexDirection: 'row',
                justifyContent: 'flex-end',}}>
            <Line />
            </View>
          

            <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
                justifyContent: 'space-between',
            }}>
            <View style={{}}>
            <Text style={styles.lefttitle}>副标题
            </Text>
            <Text style={styles.smalldes}>(限30个字符)</Text>
            </View>
            <TextInput
                style={styles.modalInput}
                placeholder="请输入副标题"
                placeholderTextColor="#AAAAAA"
                value={skuForm?.content ?? ''}
                maxLength={30}
                onChangeText={(t) =>
                  setSkuForm({ ...skuForm, content: t })
                }
              /> 
            </View>
           <View style={{width: '100%',flexDirection: 'row',
                justifyContent: 'flex-end',}}>
            <Line />
            </View>
              {/* <TextInput
                style={styles.modalInput}
                placeholder="内容(限50个字符)"
                placeholderTextColor="#AAAAAA"
                value={skuForm?.content ?? ''}
                maxLength={50}
                onChangeText={(t) =>
                  setSkuForm({ ...skuForm, content: t })
                }
              /> */}

            <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
                justifyContent: 'space-between',
            }}>
            <View style={{}}>
            <Text style={styles.lefttitle}>保底
            </Text>
            <Text style={styles.smalldes}>(填纯数字不填W)</Text>
            </View>
              <TextInput
                style={styles.modalInput}
                placeholder="请输入保底,不填为无保底"
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                maxLength={8}
                value={skuForm?.minStock ?? ''}
                onChangeText={(t) =>
                  setSkuForm({ ...skuForm, minStock: t })
                }
              />
            </View>
             <View style={{width: '100%',flexDirection: 'row',
                justifyContent: 'flex-end',}}>
            <Line />
            </View>

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
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                maxLength={8}
                value={skuForm?.price ?? ''}
                onChangeText={(t) =>
                  setSkuForm({ ...skuForm, price: t })
                }
              />
            </View>
           <View style={{width: '100%',flexDirection: 'row',
                justifyContent: 'flex-end',}}>
            <Line />
            </View>

                      <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
                justifyContent: 'space-between',
            }}>
            <View style={{}}>
            <Text style={styles.lefttitle}>划线价
            </Text>
            <Text style={styles.smalldes}>(原价或出厂价)</Text>
            </View>
              <TextInput
                style={styles.modalInput}
                placeholder="请输入划线价"
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                maxLength={8}
                value={skuForm?.originPrice ?? ''}
                onChangeText={(t) =>
                  setSkuForm({ ...skuForm, originPrice: t })
                }
              />
            </View>
           <View style={{width: '100%',flexDirection: 'row',
                justifyContent: 'flex-end',}}>
            <Line />
            </View>


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
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                maxLength={6}
                value={skuForm?.stock ?? ''}
                onChangeText={(t) =>
                  setSkuForm({ ...skuForm, stock: t })
                }
              />
            </View>
             <View style={{width: '100%',flexDirection: 'row',
                justifyContent: 'flex-end',}}>
            <Line />
            </View>


              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleSaveSku}
              >
                <Text style={styles.confirmText}>
                  {editIndex > -1 ? '保存修改' : '确认添加'}
                </Text>
              </TouchableOpacity>

              {/* ⭐ 取消改成动画关闭 */}
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