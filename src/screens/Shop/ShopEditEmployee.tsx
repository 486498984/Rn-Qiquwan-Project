import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, TextInput,TouchableWithoutFeedback,
    Keyboard,
 } from 'react-native'
import React, { useRef, useState,useEffect, } from 'react'
import { px } from '../../utils/scaleUtils';
import TextCheckboxModal from '../../components/Shop/TextCheckboxModal';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import request from '../../api/request'
import TextRadioModal from '../../components/Shop/TextRadioModal';
import {
  Toast,Modal as Modalitem,
} from '@ant-design/react-native'



const platOptions = [
  { label: '手游', value: 0 },
  { label: '端游', value: 1 },
  { label: '双端', value: 2 },
];
const Line = () => {
    return (
        <View style={{
            width: '100%', height: px(1),
            backgroundColor: 'rgba(118, 118, 118,0.2)',
        }} />
    )
}
export default function ShopEditEmployee({ navigation,route }) {
      const { type,item,storeinfo, } = route.params || {}; //1为新增 2为编辑
    const insets = useSafeAreaInsets();
    const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
    const shopsortinputRef = useRef(null); //商品排序
    const [shopsort, setShopsort] = useState(''); //商品排序
    const [visiblecommit, setVisiblecommit] = useState(false); //承诺保障开关
    const [commitvalues, setCommitvalues] = useState<(number | string)[]>([]); //承诺保障内容
    const [userinfo, setUserinfo] = useState({}); //传入信息
    const [visibleplat, setVisibleplat] = useState(false) //商品平台弹窗开关
    const [shopplat, setShopplat] = useState(0); //商品平台
    const [platform, setPlatform] = useState(platOptions); //平台列表



    useEffect(() => {
        getrolelist();
     if(item){
        console.log(item);
        setUserinfo(item);
        if(type==2){
        setShopsort(item.name)
        setShopplat(item.roleId)
        }
     }
    }, [item])
    const getrolelist = async() => { 
     try {
const response = await request({
  url: '/store/role/syslist',
  method: 'GET',
  data: {
    },
   query: {
    storeId:100,
    roleType:'STORE',
   },
    }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0) {
      const platOptions = response.data.map(item => ({
            id: item.roleId,
            label: item.roleName,
            value: item.roleId,
            }));
        console.log(platOptions);
        setPlatform(platOptions)
      }
      } catch (error) {
      console.error(error);
      }


     };
    const handleback = () => {  //返回上一页
        navigation.goBack();
    };
    const handlesubmit = async() => {  //提交
        console.log(shopplat,shopsort,item.phone,storeinfo);
          if(shopplat==0){
   Toast.show({
    content: '请先选择角色',
    duration: 2,
    position: 'center',
    mask: false,
  })
  return
 }
   if(shopsort==''){
   Toast.show({
    content: '请先填写真实姓名',
    duration: 2,
    position: 'center',
    mask: false,
  })
  return
 }
      try {
const response = await request({
  url: '/store/role/add',
  method: 'POST',
  data: {
    storeId: storeinfo,
    phone: item.phone,
    roleId: shopplat,
    name: shopsort,
    attr: "{\"level\":\"senior\"}",
    remark: ""
    },
   query: {

   },
    }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0) {
            Toast.success({
            content: '添加成功',
            duration: 2,
            position: 'center',
            mask: false,
          })
       handleback();
      }else{
            Toast.fail({
            content: response.data,
            duration: 2,
            position: 'center',
            mask: false,
          })
      }
      } catch (error) {
      console.error(error);
      }
        //navigation.navigate('ShopAddEmployee')
    };
        const getRoleName = (id) => {
        return platform.find(item => item.value === id)?.label || '请选择角色';
        };
    const handlesavesubmit = async() => {
   if(shopsort==''){
   Toast.show({
    content: '请先填写真实姓名',
    duration: 2,
    position: 'center',
    mask: false,
  })
  return
 }
 console.log(item);

      try {
const response = await request({
  url: '/store/role/update',
  method: 'PUT',
  data: {
    id:item.id,
    storeId: item.storeId,
    roleId: shopplat,
    name: shopsort,
    remark: ""
    },
   query: {

   },
    }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0) {
            Toast.success({
            content: '保存成功',
            duration: 2,
            position: 'center',
            mask: false,
          })
       handleback();
      }else{
            Toast.fail({
            content: response.data,
            duration: 2,
            position: 'center',
            mask: false,
          })
      }
      } catch (error) {
      console.error(error);
      }
    };
    return (
             <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <View style={{
                width: px(393), height: px(98), backgroundColor: '#fff',
                flexDirection: 'row', alignItems: 'flex-end',
            }}>
                <View style={{
                    width: '100%', paddingHorizontal: px(16), marginBottom: px(18),
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                }}>
                    <TouchableOpacity onPress={handleback} style={{
                        position: 'absolute',
                        left: px(16),
                    }}>
                        <Image source={require('../../../assets/images/my/left.png')}
                            style={{ width: px(22), height: px(22) }}></Image>
                    </TouchableOpacity>
                    <Text style={styles.title}>员工管理</Text>
                </View>
            </View>
            <View style={{}}>
                <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
                    paddingRight: px(16), paddingVertical: px(8)
                }}>
                    <Text style={styles.destext}>不同的角色权限不同，详情咨询客服</Text>
                </View>


                <View style={{ backgroundColor: '#fff', paddingHorizontal: px(16) }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        height: px(51),
                    }}>
                        <Text style={styles.lefttitle}>账号</Text>
                        <Text style={styles.lefttitle}>{userinfo?.phone}</Text>
                    </View>
                    <Line></Line>
                </View>

                <View style={{ backgroundColor: '#fff', paddingHorizontal: px(16) }}>
                    <TouchableOpacity style={{
                        width: '100%', height: px(51),
                        flexDirection: 'column', justifyContent: 'center',
                    }} onPress={() => {
                        shopsortinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
                    }}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', width: '100%',
                        }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Text style={styles.lefttitle}>真实姓名</Text>
                                    <Text style={[styles.lefttitle, { color: 'red' }]}>*</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                                <TextInput
                                    ref={shopsortinputRef}
                                    style={[styles.shopnameinput, { textAlign: 'right' }]}
                                    allowFontScaling={false}
                                    onChangeText={setShopsort}
                                    value={shopsort}
                                    selection={{
                                        start: shopsort.length,
                                        end: shopsort.length,
                                    }}
                                    placeholder="请输入姓名"
                                    placeholderTextColor="#AAAAAA"
                                    maxLength={18}
                                    selectionColor='#FC9026'
                                //multiline
                                //keyboardType="numeric" 
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Line></Line>
                </View>

                <TouchableOpacity style={{
                    width: '100%', height: px(51), paddingHorizontal: px(16),
                    flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff',
                }} onPress={() => setVisibleplat(true)}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between', width: '100%',
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Text style={styles.lefttitle}>角色</Text>
                            <Text style={[styles.lefttitle, { color: 'red' }]}>*</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Text style={[styles.lefttitle, { width: px(247), textAlign: 'right' }]} numberOfLines={1}>
                              {getRoleName(shopplat)}
                                </Text>
                            <Image source={require('../../../assets/images/my/right.png')}
                                style={{ width: px(19), height: px(19) }}></Image>
                        </View>
                    </View>
                </TouchableOpacity>

            </View>

            <TextCheckboxModal
                visible={visiblecommit}
                onClose={() => setVisiblecommit(false)}
                data={[
                    { label: '管理员', value: 0 },
                    { label: '运营', value: 1 },
                    { label: '财务', value: 2 },
                    { label: '客服', value: 3 },
                ]}
                value={commitvalues}
                onConfirm={(val) => {
                    setCommitvalues(val);
                    setVisiblecommit(false);
                }}
            />
    <TextRadioModal
      visible={visibleplat}
      onClose={() => setVisibleplat(false)}
      data={platform} 
      value={shopplat}
      onConfirm={(val) => {
        console.log(val);
        
        setShopplat(val);
        setVisibleplat(false);
      }}
    />

            <View style={{
                position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff',
                flexDirection: 'row', justifyContent: 'center',
            }}>
                <View style={{
                    paddingBottom: bottomSafeHeight + (Platform.OS == 'ios' ? 0 : px(8)),
                    alignItems: 'center', gap: px(3)
                }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', marginTop: px(8),
                        gap: px(21)
                    }}>
                        {type==1&&
                                <TouchableOpacity onPress={() => handlesubmit()}>
                            <LinearGradient
                                colors={['#FEC525', '#FC9026']} // 渐变颜色
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 0 }}
                                style={[styles.payBox, { width: px(242), }]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Text style={styles.xiadantx}>确定添加</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                        }
                       {type==2&&
                                <TouchableOpacity onPress={() => handlesavesubmit()}>
                            <LinearGradient
                                colors={['#FEC525', '#FC9026']} // 渐变颜色
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 0 }}
                                style={[styles.payBox, { width: px(242), }]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Text style={styles.xiadantx}>保存</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    xiadantx: {
        fontFamily: 'MiSans-Regular',
        fontSize: px(15),
        color: '#FFFFFF',
        //fontWeight:500,
        lineHeight: px(20),
    },
    payBox: {
        //marginTop: px(8),
        width: px(170),
        height: px(38),
        borderRadius: px(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    smalldes: {
        fontFamily: 'MiSans-Regular',
        fontSize: px(9),
        color: '#AAAAAA',
        fontWeight: '400',
        lineHeight: px(12),
    },
    shopnameinput: {
        //flexDirection: 'row',
        //alignItems: 'center',
        width: px(258),
        //height: 51,
        paddingVertical: 0,
        fontSize: px(14),
        fontFamily: 'MiSans-Regular',
        //backgroundColor: 'red',
    },
    lefttitle: {
        fontFamily: 'MiSans-Regular',
        fontSize: px(14),
        color: '#1A1A1A',
        fontWeight: '400',
        lineHeight: px(19),
    },
    destext: {
        fontFamily: 'MiSans-Regular',
        fontSize: px(12),
        color: 'rgba(118, 118, 118,0.6)',
        fontWeight: 400,
        lineHeight: px(16),
    },
    title: {
        fontFamily: 'MiSans-Medium',
        fontSize: px(16),
        color: '#1A1A1A',
        //fontWeight:500,
        lineHeight: px(21),
    },
    container: {
        flex: 1,
        backgroundColor: '#F2F3F5',
    }
})