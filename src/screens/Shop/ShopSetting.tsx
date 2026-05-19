import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,TextInput,Platform,
  KeyboardAvoidingView,DeviceEventEmitter,
 } from 'react-native'
import React,{useState,useRef,useEffect} from 'react'
import { px } from '../../utils/scaleUtils';
import ImageUploader from '../../components/Shop/ImageUploader';
import TextRadioModal from '../../components/Shop/TextRadioModal';
import TextCheckboxModal from '../../components/Shop/TextCheckboxModal';
import { List, PickerView,Picker } from '@ant-design/react-native'
import {DatePicker} from '@quidone/react-native-wheel-picker';
import request from '../../api/request';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMG_URL } from '../../api/config';
import { Toast } from '@ant-design/react-native'
import * as WeChat from 'react-native-wechat-lib';
import  {uploadImage}  from '../../api/uploadImage';


  // 星期数据
const weekData = [
  [
    { label: '星期一', value: '1' },
    { label: '星期二', value: '2' },
    { label: '星期三', value: '3' },
    { label: '星期四', value: '4' },
    { label: '星期五', value: '5' },
    { label: '星期六', value: '6' },
    { label: '星期日', value: '7' },
  ],
  [
    { label: '星期一', value: '1' },
    { label: '星期二', value: '2' },
    { label: '星期三', value: '3' },
    { label: '星期四', value: '4' },
    { label: '星期五', value: '5' },
    { label: '星期六', value: '6' },
    { label: '星期日', value: '7' },
  ],
];
const weekMap = {
  '1': '星期一',
  '2': '星期二',
  '3': '星期三',
  '4': '星期四',
  '5': '星期五',
  '6': '星期六',
  '7': '星期日',
};
// 补零函数
const pad = (num) => num.toString().padStart(2, '0');

// 小时
const hours = Array.from({ length: 24 }).map((_, i) => ({
  label: pad(i),   // "00" ~ "23"
  value: i,        // 0 ~ 23
}));

// 分钟
const minutes = Array.from({ length: 60 }).map((_, i) => ({
  label: pad(i),   // "00" ~ "59"
  value: i,        // 0 ~ 59
}));

const timeData = [hours, minutes];
console.log(timeData);

const Line=()=>{
    return (
    <View style={{width: '100%',height: px(1),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}/>
    )
};
 const calist=[
    { label: '三角洲行动', value: 0,id:1 },
    { label: '其他', value: 1,id:2 },
  ]
export default function ShopSetting({navigation,route}) {
  const {storeinfo}=route.params || {}
     const insets = useSafeAreaInsets(); 
      const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
  const shopnameinputRef = useRef(null); //店铺名称
  const shopcominputRef = useRef(null); //主体名称
  const shopadressinputRef = useRef(null); //详细地址
  const shopcomcodeinputRef = useRef(null); //主体名称
  const shopcomnameinputRef = useRef(null); //法人姓名
  const shopconnectnameinputRef = useRef(null); //法人姓名
  const shopconnectphoneinputRef = useRef(null); //法人姓名
  const [shopname, setShopname] = useState(''); //店铺名称
  const [category, setCategory] = useState(calist); //店铺分类
  const [company, setCompany] = useState(''); //主体名称
  const [companyadress, setCompanyadress] = useState(''); //详细地址
  const [companycode, setCompanycode] = useState(''); //统一社会信用代码
  const [companyname, setCompanyname] = useState(''); //法人姓名
  const [connectname, setConnectname] = useState(''); //联系人姓名
  const [connectphone, setConnectphone] = useState(''); //联系电话
  const [shoplogo, setShoplogo] = useState<any[]>([]); //logo图
  const [businessimg, setBusinessimg] = useState([]); //营业执照图
  const [shopphoto, setShopphoto] = useState([]); //店铺相册
  const [visibletype, setVisibletype] = useState(false) //主营类型弹窗开关
  const [storevalues, setStorevalues] = useState<(number | string)[]>([]); //主营类型
  const [shopinfotx, setShopinfotx] = useState(null); //商品详情
  const scrollRef = React.useRef(null); //总的scollview
  const [regionvalue, setRegionvalue] = useState<any[]>([]) //地址选择
  const [allvalue, setAllvalue] = useState([]) //省市区所有数据
  const [visibleregion, setVisibleregion] = useState(false); //省市区选择开关
  const [extend, setExtend] = useState(null); //是否选择省市区
  const [oneweekExtend, setOneweekExtend] = useState(null); //是否选择第一个日期
  const [twoweekExtend, setTwoweekExtend] = useState(null); //是否选择第二个日期
  const [weekonevalue, setWeekonevalue] = useState<any[]>(['1']) //营业日期第一个选择结果
  const [weektwovalue, setWeektwovalue] = useState<any[]>(['7']) //营业日期第二个选择结果
  const [visibleoneweek, setVisibleoneweek] = useState(false); //营业日期第一个选择开关
  const [visibletwoweek, setVisibletwoweek] = useState(false); //营业日期第二个选择开关
  const [extendonetime, setExtendonetime] = useState(null); //是否选择第一个营业时间
  const [onetimevalue, setOnetimevalue] = useState([9,0]) //营业时间第一个选择结果
  const [visibleonetime, setVisibleonetime] = useState(false); //营业时间第一个选择开关
  const [extendtwotime, setExtendtwotime] = useState(null); //是否选择第二个营业时间
  const [twotimevalue, setTwotimevalue] = useState([22,0]) //营业时间第二个选择结果
  const [visibletwotime, setVisibletwotime] = useState(false); //营业时间第二个选择开关

const [weekRange, setWeekRange] = useState(['1', '7']);
const [weekExtend, setWeekExtend] = useState(null);
const [visibleWeek, setVisibleWeek] = useState(false);

useEffect(() => {
  const init = async () => {
    await getregion();     // 先拿地址树
    await getcategory();   // 再拿分类

    if (storeinfo) {
      await getstoreinfo(storeinfo); // 最后再回填
    }
  };

  init();
}, [storeinfo]);
  const getcategory = async() => {  //获取店铺分类
    try {
      const response = await request({
        url: '/category/tree',
        method: 'GET',
        data:{},
        query: {}
      });
      console.log(response);
    if(response.data!==undefined&&response.code==0){
      let res=response.data
      const calist = res.map((item, index) => ({
        label: item.name,
        value: index, // 从0开始
        id: item.id,
      }));
      console.log(calist);
      setCategory(calist)
    }
    } catch (error) {
      console.error(error);
    }
   };
   function getIndexArray(input, arr) {
  if (!input || typeof input !== 'string') return [];

  return input
    .split(',')
    .map(v => Number(v.trim()))   // 转数字
    .map(id => arr.findIndex(item => item.id === id)) // 找下标
    .filter(index => index !== -1); // 过滤不存在的
}
  const getstoreinfo = async(e) => {  //获取店铺信息
    try {
      const response = await request({
        url: '/store/detail',
        method: 'GET',
        data:{},
        query: {id:e.id}
      });
      console.log(response);
    if(response.data!==undefined&&response.code==0){
      let res=response.data
      setShopname(res.storeName)
      setShoplogo(getImageArray(res.storeLogo, IMG_URL)) //俱乐部logo
      setShopphoto(getImageArray(res.storePhoto, IMG_URL)) //俱乐部相册
      setBusinessimg(getImageArray(res.licensePhoto, IMG_URL)) //营业执照
      console.log(res.address);
      setShopinfotx(res.storeDesc)
      setCompany(res.licenseName)
      setCompanycode(res.licenseCode)
      setCompanyname(res.legalPerson)
      setConnectname(res.contactName)
      setConnectphone(res.contactPhone)
      setCompanyadress(res.address)
      if(res.province!==null&&res.city!==null&&res.district!==null){
      const names = [res.province,res.city,res.district];
      console.log(names);
      
      getvregion(names).then(res => {
        console.log(res);
        
        setRegionvalue(res.values)
        let abc={
        items:res.items}
         setExtend(abc)
        console.log('value路径:', res.values);
        console.log('items:', res.items);
      });
      }
    let opentimes=JSON.parse(res.openHours)
    if(opentimes!==null&&opentimes!==""&&opentimes.start!==undefined){
    setOnetimevalue(opentimes.start)
    setTwotimevalue(opentimes.end)
    setWeekRange(opentimes.week)
    }
    setStorevalues(getIndexArray(res.categoryIds, category))
    }
    } catch (error) {
      console.error(error);
    }
    };
  const getImageArray = (str, baseUrl = '') => {
  if (!str) return []
  return str.split(',').map(item => ({
    uri: baseUrl + item.trim()
  }))
 };
const getRegionByNames = (names, data) => {
  const values = [];
  const items = [];

  let currentLevel = data;

  for (let i = 0; i < names.length; i++) {
    const name = names[i];

    if (!Array.isArray(currentLevel)) break;

    const node = currentLevel.find(item => item.value === name);

    if (!node) break;

    values.push(node.value);
    items.push({
      label: node.label,
      value: node.value,
    });

    currentLevel = node.children || [];
  }

  return {
    values,
    items,
  };
};
const getvregion = async (names) => {
  try {
    const response = await request({
      url: '/region/full-tree',
      method: 'GET',
    });

    if (response.data && response.code === 0) {
      const tree = response.data;

      const pickerData = transformRegionData(tree);
      //setAllvalue(pickerData);
      console.log(pickerData);
      
      // ✅ 关键：反查名字
      if (names?.length) {
        const res = getRegionByNames(names, pickerData);
        console.log(res);
        
        console.log(res.values); // ['510000','510100','510122']
        console.log(res.items);

        return res; // 👈 可选：返回给外面用
      }
    }
  } catch (error) {
    console.error(error);
  }
};
  const getregion = async() => { 
           try {
             const response = await request({
               url: '/region/full-tree',
               method: 'GET',
               data:{},
               query: {  }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
            const pickerData = transformRegionData(response.data);
            setAllvalue(pickerData)
            console.log(pickerData);
            }
           } catch (error) {
             console.error(error);
           }
  };
     const handleback = () => {  //返回上一页
   navigation.goBack();
     };
     const onChangeShopinfotx = (e) => {  //修改商品详情
    console.log(e);
    setShopinfotx(e)
};
const transformRegionData = (list) => {
  return list.map(item => {
    return {
      label: item.name,
      value: String(item.code), // ⚠️建议转 string（antd更稳）
      children: item.children?.length
        ? transformRegionData(item.children)
        : []
    };
  });
};
 
const handlesubmit = async() => {  //提交

  console.log(shopname);
  console.log(shoplogo);
  console.log(storevalues);
  console.log(shopinfotx);
  console.log(shopphoto);
  console.log(company);
  console.log(regionvalue);
  console.log(category);
  


  console.log(oneweekExtend);
  // 开始时间
  const startTime = formatTime(onetimevalue);
  // 结束时间
  const endTime = formatTime(twotimevalue);
  console.log(startTime); // 09:00
  console.log(endTime);   // 22:30
  console.log(weekMap[weekRange?.[0]]);
  console.log(weekMap[weekRange?.[1]]);
  console.log(weekRange,onetimevalue,twotimevalue);
  console.log(companyadress);
  
  if(shopname==""){
  Toast.show({ content: '请输入俱乐部名称' });
  return
  }
  if(shoplogo.length==0){
  Toast.show({ content: '请选择俱乐部logo' });
  return
  }
  if(storevalues.length==0){
  Toast.show({ content: '请选择主营游戏类型' });
  return
  }
  if(shopinfotx==""){
  Toast.show({ content: '请输入俱乐部介绍' });
  return
  }
  // if(companycode.length!==18){
  // Toast.show({ content: "统一社会信用代码必须为18位" });
  // return
  // }
  
  const finlogo = await handleUploadAndFormat(shoplogo);
  const finphoto = await handleUploadAndFormat(shopphoto);
  const finbusin = await handleUploadAndFormat(businessimg);
  console.log(finlogo);
  console.log(finphoto);
  console.log(finbusin);
  const result = storevalues
  .map(index => category[index]?.id)
  .filter(id => id !== undefined)
  .join(',');
console.log(result);
  const opentime={start:onetimevalue,end:twotimevalue,week:weekRange}
  //return;
  handleformal(finlogo,finphoto,finbusin,opentime,result)
};
 const handleformal = async(finlogo,finphoto,finbusin,opentime,result) => { 
       try {
    const response = await request({
      url: '/store/update-app',
      method: 'PUT',
      data:{
      id: 1,
    storeName: shopname,
    storeLogo: finlogo,
    storeDesc: shopinfotx,
    storePhoto: finphoto,
    categoryIds: result,
    licensePhoto: finbusin,
    licenseName: company,
    licenseCode: companycode,
    legalPerson: companyname,
    legalPersonPhoto: "",
    contactName: connectname,
    contactPhone: connectphone,
    province: regionvalue[0],
    city: regionvalue[1],
    district: regionvalue[2],
    address: companyadress,
    lngLat: "",
    openHours: JSON.stringify(opentime),
    //openStatus: "BUSY",
    tags: ""
      },
      query: {}
    });
    console.log(response);
    if(response.data!==null&&response.data!==undefined&&response.code==0){
    Toast.success({
        content: '保存成功',
        duration: 2,
        position: 'center',
        mask: false,
      })
    }else{
       Toast.fail({
        content: '保存失败，请稍后再试',
        duration: 2,
        position: 'center',
        mask: false,
      })
    }
    
  } catch (error) {
    console.error(error);
  } 
  };
 const handleUploadAndFormat = async (imageList) => {
   try {
     if (!Array.isArray(imageList) || imageList.length === 0) {
       return '';
     }
 
     // 最终结果（保持原顺序）
     const resultList = [];
 
     // 本地图片待上传列表
     const localImages = [];
 
     // 记录本地图片在原数组中的位置
     const localIndexes = [];
 
     imageList.forEach((item, index) => {
       const uri = item?.uri;
 
       if (!uri) return;
 
       // 网络图
       if (uri.startsWith('http')) {
         const uploadIndex = uri.indexOf('upload/');
         if (uploadIndex !== -1) {
           const realPath = uri.substring(uploadIndex + 7); // 去掉 "upload/"
           resultList[index] = realPath;
         } else {
           resultList[index] = uri; // 防止异常格式
         }
       }
 
       // 本地图
       else {
         localImages.push(uri);
         localIndexes.push(index);
       }
     });
 
     // 上传本地图片
     if (localImages.length > 0) {
       const res = await uploadImage(localImages);
 
       const serverImages = Array.isArray(res.data) ? res.data : [];
 
       serverImages.forEach((img, i) => {
         const originalIndex = localIndexes[i];
         resultList[originalIndex] = img;
       });
     }
 
     // 去掉空值并拼接
     return resultList.filter(Boolean).join(',');
   } catch (error) {
     Toast.removeAll();
     Toast.fail('上传图片失败，请稍后重试');
     console.log('上传处理失败:', error);
     return '';
   }
 };
 const formatTime = (time) => {
  const hour = String(time[0]).padStart(2, '0');
  const minute = String(time[1]).padStart(2, '0');

  return `${hour}:${minute}`;
};
 const getLabels = (values, data) => {
  return data
    .filter(item => values.includes(item.value))
    .map(item => item.label)
    .join('、');
};
const normalizeWeekRange = (v) => {
  const start = Number(v[0]);
  const end = Number(v[1]);

  if (start <= end) {
    return [v[0], v[1]];
  }

  // 颠倒
  return [v[1], v[0]];
};
// 时间排序
const normalizeTimeRange = (start, end) => {
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];

  // 开始时间 <= 结束时间
  if (startMinutes <= endMinutes) {
    return {
      start,
      end,
    };
  }

  // 颠倒
  return {
    start: end,
    end: start,
  };
};
  return (
    
    <View style={styles.container}>
      <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={0}
  >
    <View style={styles.container}>
           <View style={{width: px(393),height: px(98),backgroundColor: '#fff',
                      flexDirection: 'row',alignItems: 'flex-end',
                    }}>
                      <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(18),
                        flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                      }}>
                 <TouchableOpacity onPress={handleback}  style={{  position: 'absolute',
                  left: px(16),}}>
                   <Image source={require('../../../assets/images/my/left.png')} 
                   style={{width:px(22),height:px(22)}}></Image>
                   </TouchableOpacity>
                   <Text style={styles.title}>店铺设置</Text>
                      </View>
                    </View>

<ScrollView contentContainerStyle={{paddingTop:px(16),paddingBottom:px(155),flexGrow: 1}} 
 ref={scrollRef} keyboardShouldPersistTaps="handled">
<View style={{width: '100%',backgroundColor: '#fff',paddingHorizontal:px(16),}}>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}}   onPress={() => {
    shopnameinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
           <View style={{flexDirection: 'row',alignItems: 'center',}}>
        <Text style={styles.lefttitle}>俱乐部名称</Text>
        <Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
            </View>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <TextInput
  ref={shopnameinputRef}
  //textAlign='right'
           style={[styles.shopnameinput]}
          allowFontScaling={false}
          onChangeText={setShopname}
          value={shopname}
          //   selection={{
          // start: shopname.length,
          // end: shopname.length,
          // }}
          placeholder="请输入俱乐部名称"
           placeholderTextColor="#AAAAAA"
            maxLength={8}
            selectionColor='#FC9026'
            //multiline
            //keyboardType="numeric" 
        />
</View>
</View>
</TouchableOpacity>
<Line/>
  <View style={{width: '100%',paddingTop:px(16),
    flexDirection: 'column',justifyContent: 'center',
    }}>
   <View style={{flexDirection: 'column',paddingBottom:px(16)}}>
     <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>俱乐部Logo</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
      <Text style={styles.smalldes}>(请使用正方形图片)</Text>
      <ImageUploader
        max={1}
        value={shoplogo}
        onChange={setShoplogo}
        />
      </View>
  </View>
 <Line/>
<TouchableOpacity style={{width: '100%',backgroundColor: '#fff',height: px(51),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    paddingHorizontal:px(0),
}} onPress={()=>setVisibletype(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>主营游戏类型</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={[styles.lefttitle,{width: px(247),textAlign:'right'}]} numberOfLines={1}>
  {/* {storevalues?.length ? storevalues.join('、') : '请选择'} */}
    {storevalues?.length
    ? getLabels(storevalues, category)
    : '请选择'}
  </Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</TouchableOpacity>
     <Line/>
<View style={{width: '100%',backgroundColor: '#fff',
    paddingVertical:px(16),paddingHorizontal:px(0),marginTop: px(0),
}}>
<View style={{width: '100%',
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(0),
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>俱乐部介绍</Text>
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
    placeholder="简单介绍下你的俱乐部~"
    //keyboardType="number-pad"
    placeholderTextColor="#AAAAAA"
    maxLength={50}
    selectionColor='#FC9026'
    textAlignVertical="top"  
    onFocus={() => {
  // if (Platform.OS === 'ios') {
  //   scrollRef.current?.scrollToEnd({ animated: true });
  // }
  }}
    />
    </View>

<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <Text style={styles.count}>
        {shopinfotx?.length||0}
      </Text>
      <Text style={styles.countf}>/50</Text>
</View>
</View>
</View>
  <View style={{width: '100%',paddingTop:px(0),
  flexDirection: 'column',justifyContent: 'center',
  }}>
  <View style={{flexDirection: 'column',paddingBottom:px(16)}}>
  <Text style={styles.lefttitle}>俱乐部相册</Text>
    <ImageUploader
      max={4}
      value={shopphoto}
      onChange={setShopphoto}
      />
    </View>
    </View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',paddingHorizontal:px(16),marginTop: px(16),}}>
  <View style={{width: '100%',paddingTop:px(16),
    flexDirection: 'column',justifyContent: 'center',
    }}>
   <View style={{flexDirection: 'column',paddingBottom:px(16)}}>
<Text style={styles.lefttitle}>营业执照</Text>
      {/* <Text style={styles.smalldes}>(请使用正方形jpg格式的图片)</Text> */}
      <ImageUploader
        max={1}
        value={businessimg}
        onChange={setBusinessimg}
        />
      </View>
  </View>
<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}}   onPress={() => {
    shopcominputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
        <Text style={styles.lefttitle}>主体名称</Text>
            </View>
<View style={{
    //flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //width: 100,
    //backgroundColor: 'red',
  }}>
 <TextInput
  ref={shopcominputRef}
          style={[styles.shopnameinput]}
          allowFontScaling={false}
          onChangeText={setCompany}
          value={company}
          // selection={{ 
          // start: company.length,
          // end: company.length,
          // }}
          placeholder="请输入主体名称"
           placeholderTextColor="#AAAAAA"
            maxLength={28}
            selectionColor='#FC9026'
            onFocus={() => {
            if (Platform.OS === 'ios') {   // 👈 只在 iOS 执行
              scrollRef.current?.scrollTo({
                  y: px(550),
                  animated: true,
              });
              }
          }}
        />
</View>
</View>
</TouchableOpacity>
<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}}   onPress={() => {
    shopcomcodeinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
        <Text style={styles.lefttitle}>统一社会信用代码</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <TextInput
  ref={shopcomcodeinputRef}
  //textAlign='right'
          style={[styles.shopnameinput]}
          allowFontScaling={false}
          onChangeText={setCompanycode}
          value={companycode}
          // selection={{ 
          // start: companycode.length,
          // end: companycode.length,
          // }}
          placeholder="请输入统一社会信用代码"
           placeholderTextColor="#AAAAAA"
            maxLength={20}
            selectionColor='#FC9026'
              onFocus={() => {
            if (Platform.OS === 'ios') {   // 👈 只在 iOS 执行
              scrollRef.current?.scrollTo({
                  y: px(600),
                  animated: true,
              });
              }
            }}
            //multiline
            //keyboardType="numeric" 
          />
</View>
</View>
</TouchableOpacity>
<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}}   onPress={() => {
    shopcomnameinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
        <Text style={styles.lefttitle}>法定代表人</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <TextInput
  ref={shopcomnameinputRef}
  //textAlign='right'
          style={[styles.shopnameinput]}
          allowFontScaling={false}
          onChangeText={setCompanyname}
          value={companyname}
          // selection={{ 
          // start: companyname.length,
          // end: companyname.length,
          // }}
          placeholder="请输入法定代表人"
           placeholderTextColor="#AAAAAA"
            maxLength={10}
            selectionColor='#FC9026'
                  onFocus={() => {
            if (Platform.OS === 'ios') {   // 👈 只在 iOS 执行
              scrollRef.current?.scrollTo({
                  y: px(650),
                  animated: true,
              });
              }
          }}
            //multiline
            //keyboardType="numeric" 
          />
</View>
</View>
</TouchableOpacity>
<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}}   onPress={() => {
    shopconnectnameinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
        <Text style={styles.lefttitle}>联系人</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <TextInput
  ref={shopconnectnameinputRef}
  //textAlign='right'
          style={[styles.shopnameinput]}
          allowFontScaling={false}
          onChangeText={setConnectname}
          value={connectname}
          // selection={{ 
          // start: connectname.length,
          // end: connectname.length,
          // }}
          placeholder="请输入联系人"
           placeholderTextColor="#AAAAAA"
            maxLength={10}
            selectionColor='#FC9026'
            onFocus={() => {
            if (Platform.OS === 'ios') {   // 👈 只在 iOS 执行
              scrollRef.current?.scrollTo({
                  y: px(690),
                  animated: true,
              });
              }
          }}
            //multiline
            //keyboardType="numeric" 
          />
</View>
</View>
</TouchableOpacity>
<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}}   onPress={() => {
    shopconnectphoneinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
        <Text style={styles.lefttitle}>联系人电话</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <TextInput
  ref={shopconnectphoneinputRef}
  //textAlign='right'
          style={[styles.shopnameinput]}
          allowFontScaling={false}
          onChangeText={setConnectphone}
          value={connectphone}
          // selection={{ 
          // start: connectphone.length, 
          // end: connectphone.length,
          // }}
          placeholder="请输入联系人电话"
           placeholderTextColor="#AAAAAA"
            maxLength={11}
            selectionColor='#FC9026'
            //multiline
            keyboardType="numeric" 
            onFocus={() => {
            if (Platform.OS === 'ios') {   // 👈 只在 iOS 执行
              scrollRef.current?.scrollTo({
                  y: px(700),
                  animated: true,
              });
              }
          }}
          />
</View>
</View>
</TouchableOpacity>
<Line/>
<TouchableOpacity style={{width: '100%',backgroundColor: '#fff',height: px(51),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    paddingHorizontal:px(0),
}} onPress={()=> setVisibleregion(true)}>
<Text style={styles.lefttitle}>公司地址</Text>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>{extend?.items?.map(i => i.label).join('-') || '请选择'}</Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</TouchableOpacity>
<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}}   onPress={() => {
    shopadressinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
        <Text style={styles.lefttitle}>详细地址</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
     <TextInput
          ref={shopadressinputRef}
          style={[styles.shopnameinput]}
          allowFontScaling={false}
          onChangeText={setCompanyadress}
          value={companyadress}
          // selection={{ 
          // start: companyadress.length,
          // end: companyadress.length,
          // }}
          placeholder="请输入详细地址"
           placeholderTextColor="#AAAAAA"
            maxLength={28}
            selectionColor='#FC9026'
              onFocus={() => {
            if (Platform.OS === 'ios') {   // 👈 只在 iOS 执行
              scrollRef.current?.scrollTo({
                  y: px(800),
                  animated: true,
              });
              }
          }}
        />
</View>
</View>
</TouchableOpacity>
</View>

<View style={{width: '100%',backgroundColor: '#fff',paddingHorizontal:px(16),marginTop: px(16),}}>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
   }} onPress={()=>setVisibleWeek(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
           <View style={{flexDirection: 'row',alignItems: 'center',}}>
        <Text style={styles.lefttitle}>营业日期</Text>
        <Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
            </View>
            <Text style={styles.smalldes}>其余时间默认关闭店铺</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',gap:px(12)}}>
<View style={{width: px(54),height: px(25),backgroundColor: '#F4F4F4',borderRadius: px(4),
  flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
}} >
<Text style={styles.weektext}>
  {weekMap[weekRange?.[0]] || '星期一'}
</Text>
</View>
 <Text style={styles.lefttitle}>至</Text>
 <View style={{width: px(54),height: px(25),backgroundColor: '#F4F4F4',borderRadius: px(4),
  flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
 }}>
<Text style={styles.weektext}>
  {weekMap[weekRange?.[1]] || '星期日'}
</Text>
</View>
</View>
</View>

</TouchableOpacity>
<Line/>
<View style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
   }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
           <View style={{flexDirection: 'row',alignItems: 'center',}}>
        <Text style={styles.lefttitle}>营业时间</Text>
        <Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
            </View>
            <Text style={styles.smalldes}>其余时间默认关闭店铺</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',gap:px(12)}}>
<TouchableOpacity style={{width: px(54),height: px(25),backgroundColor: '#F4F4F4',borderRadius: px(4),
  flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
}} onPress={()=>  setVisibleonetime(true)}>
 <Text style={styles.weektext}>{timeData[0][onetimevalue[0]].label+':'+timeData[1][onetimevalue[1]].label}</Text>
</TouchableOpacity>
 <Text style={styles.lefttitle}>至</Text>
 <TouchableOpacity style={{width: px(54),height: px(25),backgroundColor: '#F4F4F4',borderRadius: px(4),
  flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
 }} onPress={()=>setVisibletwotime(true)}>
 <Text style={styles.weektext}>{timeData[0][twotimevalue[0]].label+':'+timeData[1][twotimevalue[1]].label}</Text>
</TouchableOpacity>
</View>
</View>

</View>

</View>

<View style={{height: 0,}}></View>

</ScrollView>

<TextCheckboxModal
  visible={visibletype}
  onClose={() => setVisibletype(false)}
  data={category}
  value={storevalues}
  onConfirm={(val) => {
    setStorevalues(val);
    setVisibletype(false);
  }}
 />
 <Picker
  data={allvalue}
  cols={3}
  visible={visibleregion}
  value={regionvalue}
  onVisibleChange={setVisibleregion}
  onOk={(v, ext) => {
    console.log(v, ext);
    setRegionvalue(v);
    setExtend(ext);
    setVisibleregion(false);
  }}
/> 
<Picker
  data={weekData}
  cols={2}
  cascade={false}
  visible={visibleWeek}
  value={weekRange}
  onVisibleChange={setVisibleWeek}
  onOk={(v, ext) => {
     const fixed = normalizeWeekRange(v);

    setWeekRange(fixed);
    setWeekExtend(ext); // ⚠️ ext 不一定是修正后的，要重新算
    setVisibleWeek(false);
  }}
/>

 <Picker
  data={timeData}
  cols={2}
  cascade={false} 
  visible={visibleonetime}
  value={onetimevalue}
  onVisibleChange={setVisibleonetime}
  onOk={(v, ext) => {

    // 用当前结束时间比较
    const fixed = normalizeTimeRange(v, twotimevalue);

    setOnetimevalue(fixed.start);
    setTwotimevalue(fixed.end);

    setExtendonetime(ext);
    setVisibleonetime(false);
  }}
/>
 <Picker
  data={timeData}
  cols={2}
  cascade={false} 
  visible={visibletwotime}
  value={twotimevalue}
  onVisibleChange={setVisibletwotime}
  onOk={(v, ext) => {

    // 用当前开始时间比较
    const fixed = normalizeTimeRange(onetimevalue, v);

    setOnetimevalue(fixed.start);
    setTwotimevalue(fixed.end);

    setExtendtwotime(ext);
    setVisibletwotime(false);
  }}
/>
    </View>
  </KeyboardAvoidingView>
      <View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),
    alignItems: 'center',gap:px(3)}}>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
    gap:px(21)
}}>

 {/* <TouchableOpacity>
<View style={styles.cannelbox}>
<Text style={styles.canneltx}>取消订单</Text>
</View>
       </TouchableOpacity> */}


       <TouchableOpacity onPress={()=>handlesubmit()}>
        <LinearGradient
              colors={['#FEC525', '#FC9026']} // 渐变颜色
              start={{ x: 1, y: 0 }}   
              end={{ x: 0, y: 0 }}
              style={[styles.payBox,{width: px(242),}]}
              >
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
              <Text style={styles.xiadantx}>保存</Text>
              </View>
              </LinearGradient>
              </TouchableOpacity>
</View>
</View>
</View>  
    </View>
   
  )
}

const styles = StyleSheet.create({
                xiadantx:{
      fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(20),
    },
            payBox:{
      //marginTop: px(8),
  width: px(170),
  height: px(38),
  borderRadius: px(30),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
  weektext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(19),
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
  height: px(86),
  fontSize: px(14),
   fontFamily: 'MiSans-Regular',
    },
      imgsmalltx:{
fontFamily: 'MiSans-Regular',
        fontSize:px(9),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(12),
    },
      shopnameinput:{
        //flexDirection: 'row',
        //alignItems: 'center',
    //width: px(258),
    //height: 51,
    paddingVertical:0,
    fontSize: px(14),
    fontFamily: 'MiSans-Regular',
    //backgroundColor: 'red',
    },
      smalldes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(9),
        color:'#AAAAAA',
        fontWeight:'400',
        lineHeight:px(12),
    },
      lefttitle:{
       fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:'400',
        lineHeight:px(19),
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