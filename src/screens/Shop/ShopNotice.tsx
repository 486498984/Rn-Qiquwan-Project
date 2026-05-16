import { StyleSheet, Text, View,TouchableOpacity,Image,Platform,TextInput,TouchableWithoutFeedback,
    Keyboard,
 } from 'react-native'
import React,{useState,useEffect,} from 'react'
import { px } from '../../utils/scaleUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import request from '../../api/request';
import {Toast } from '@ant-design/react-native'

const Line=()=>{
    return (
    <View style={{width: '100%',height: px(1),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}/>
    )
}
export default function ShopNotice({navigation ,route}) {
    const {storeinfo} = route.params
const [shopinfotx, setShopinfotx] = useState(null); //商品详情
const shoptitleinputRef = React.useRef(null); //商品标题
const [shoptitle, setShoptitle] = useState(''); //商品标题
const [isnotice, setIsnotice] = useState(false); //是否存在公告
const [idnotice, setIdnotice] = useState(""); //公告id
    const insets = useSafeAreaInsets();
    const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）

useEffect(() => {
  if(storeinfo){
    getnoticelist(storeinfo)
  }
}, [storeinfo])
 const getnoticelist = async(e) => { 
    console.log(e);
     try {
const response = await request({
  url: '/store/notice/list',
  method: 'GET',
  data: {
    },
   query: {
    storeId:e,
    status:'PUBLISHED',
    page:1,
    pageSize:10
   },
    }); 
      console.log('address',response);
      if (response.data.list !== null && response.code == 0&&response.data.list !== undefined&&response.data.list.length !== 0) {
      console.log(response.data.list);
      setShopinfotx(response.data.list[0].content)
      setIdnotice(response.data.list[0].id)
      setIsnotice(true) 
      }else{ 
      setIsnotice(false)
      }
      } catch (error) {
      console.error(error);
      }
  }

const onChangeShopinfotx = (e) => {  //修改商品详情
    console.log(e);
    setShopinfotx(e)
};
     const handleback = () => {  //返回上一页
   navigation.goBack();
     };
         const handlesubmit = async() => {  //提交
        console.log(idnotice);
       if(isnotice){ //编辑
     try {
    const response = await request({
    url: '/store/notice/update',
    method: 'PUT',
    data: {
    id: idnotice,
    storeId: storeinfo,
    title: "标题",
    content: shopinfotx,
    coverImage: "",
    noticeType: "TEXT",
    isTop: 1,
    status: "PUBLISHED",
    sort: 99
    },
   query: {},
    }); 
      console.log('address',response);
      if(response.data !== null && response.code == 0) {
     Toast.success({content: '保存成功',mask:false,duration:2})
      }else{
        Toast.fail({content: '保存失败,请稍后再试',mask:false,duration:2})
      }
      } catch (error) {
      console.error(error);
      }
       }else{ //新增
     try {
    const response = await request({
    url: '/store/notice/add',
    method: 'POST',
    data: {
  storeId: storeinfo,
  title: "标题",
  content: shopinfotx,
  coverImage: "",
  noticeType: "TEXT",
  isTop: 1,
  sort: 100
    },
   query: {},
    }); 
      console.log('address',response);
      if(response.data !== null && response.code == 0) {
        Toast.success({content: '保存成功',mask:false,duration:2})
      getnoticelist(storeinfo)
      }else{ 
        Toast.fail({content: '保存失败,请稍后再试',mask:false,duration:2})
      }
      } catch (error) {
      console.error(error);
      }
       }  
        //navigation.navigate('ShopAddEmployee')
    };
  return (
         <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
        <View style={{width: px(393),height: px(98),backgroundColor: '#fff',
                     flexDirection: 'row',alignItems: 'flex-end',
                   }}>
                     <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(18),
                       flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                     }}>
                <TouchableOpacity onPress={handleback} style={{  position: 'absolute',
                 left: px(16),}}>
                  <Image source={require('../../../assets/images/my/left.png')} 
                  style={{width:px(22),height:px(22)}}></Image>
                  </TouchableOpacity>
                  <Text style={styles.title}>店铺公告</Text>
                     </View>
        </View>
<View style={{marginTop: px(16),backgroundColor: '#fff',}}>
    {/* <TouchableOpacity style={{width: '100%',height: px(70),
    flexDirection: 'column',justifyContent: 'center',paddingHorizontal:px(16)
}}   onPress={() => {
    shoptitleinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>标题</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
                <Text style={styles.smalldes}>(限30个字符)</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <TextInput
  ref={shoptitleinputRef}
          style={styles.shopnameinput}
          allowFontScaling={false}
          onChangeText={setShoptitle}
          value={shoptitle}
          placeholder="请输入标题"
           placeholderTextColor="#AAAAAA"
            maxLength={30}
            selectionColor='#FC9026'
            multiline
        />
</View>
</View>
</TouchableOpacity> */}
{/* <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
paddingHorizontal:px(16)
}}>
<Line/>
</View> */}

<View style={{width: '100%',backgroundColor: '#fff',
    paddingVertical:px(16),paddingHorizontal:px(16),marginTop: px(0),
}}>
<View style={{width: '100%',
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(0),
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>内容</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>

</View>

<View style={{width: '100%',backgroundColor: '#F7F8FC',
    marginTop: px(16),padding:px(16),borderRadius: px(8),
}}>



    <View style={{flexDirection: 'row',}}>
     <Image source={require('../../../assets/images/my/edit.png')} 
     style={{width:px(19),height:px(19),marginTop: px(0),}}></Image>
    <TextInput
    allowFontScaling={false}
    multiline
    style={styles.inputbox}
    onChangeText={onChangeShopinfotx}
    value={shopinfotx || ''}
    placeholder="请输入内容"
    //keyboardType="number-pad"
    placeholderTextColor="#AAAAAA"
    maxLength={100}
    selectionColor='#FC9026'
    textAlignVertical="top"  
    />
    </View>

<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <Text style={styles.count}>
        {shopinfotx?.length||0}
      </Text>
      <Text style={styles.countf}>/100</Text>
</View>
</View>
</View>
</View>


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
                                <TouchableOpacity onPress={() => handlesubmit()}>
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
        smalldes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(9),
        color:'#AAAAAA',
        fontWeight:'400',
        lineHeight:px(12),
    },
        shopnameinput:{
        //flexDirection: 'row',
        //alignItems: 'center',
    width: px(258),
    //height: 51,
    paddingVertical:0,
    fontSize: px(14),
    fontFamily: 'MiSans-Regular',
    //backgroundColor: 'red',
    },
            countf:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(19),
    },
    count:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(19),
    },
        lefttitle:{
       fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:'400',
        lineHeight:px(19),
    },
      inputbox:{
  paddingTop: px(0),     // ✅ 关键：统一顶部间距
  paddingBottom: px(8),
  paddingLeft: px(0),
  paddingRight: px(8),
  textAlignVertical: 'top', // Android 必须

    //backgroundColor: 'red',
    marginLeft: px(8),
  flexDirection: 'row',
  alignItems: 'center',
  width: px(310),
  height: px(130),
  fontSize: px(14),
   fontFamily: 'MiSans-Regular',
    },
   title:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
  },
    container:{
        flex: 1,
        backgroundColor: '#F2F3F5',
    }
})