import { StyleSheet, Text, View,TouchableOpacity,Image,
ScrollView,useWindowDimensions,TextInput,Platform,
 } from 'react-native'
import React,{useEffect,useRef,useCallback,useState,} from 'react'
import { px } from '../../utils/scaleUtils';
import request from '../../api/request';
import { TabView,SceneMap } from 'react-native-tab-view';
import TextRadioModal from '../../components/Shop/TextRadioModal';
import TagInputModal from '../../components/Shop/TagInputModal';
import TextCheckboxModal from '../../components/Shop/TextCheckboxModal';
import ImageUploader from '../../components/Shop/ImageUploader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import SkuModal from './components/SkuModal';
import AddonModal from './components/AddonModal';
import  {uploadImage}  from '../../api/uploadImage';
import {
  Toast,
  Checkbox,
  Modal as Modalitem,
} from '@ant-design/react-native'
import { IMG_URL } from '../../api/config';
import useAuthStore from '../../utils/zustand';


const gameOptions = [
  { label: '三角洲', value: 0 },
  { label: '王者荣耀', value: 1 },
];
  const ishot=[
    { label: '热销', value: 0 },
    { label: '新品', value: 1 },
    { label: '推荐', value: 2 },
  ]
const typeOptions = [
  { label: '护航', value: 0 ,id:11},
  { label: '陪玩', value: 1 ,id:12},
  { label: '任务', value: 2 ,id:13},
  { label: '跑刀', value: 3 ,id:14}, 
];
const mapOptions = [
  { label: '零号大坝', value: 0 },
  { label: '长弓溪谷', value: 1 },
  { label: '巴克什', value: 2 },
  { label: '航天基地', value: 3 }, 
  { label: '潮汐监狱', value: 4 }, 
  { label: '全部', value: 5 }, 
];
  const Line=()=>{
    return (
    <View style={{width: '100%',height:StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}/>
    )
};
const modeOptions = [
  { label: '普通', value: 0 },
  { label: '机密', value: 1 },
  { label: '绝密', value: 2 },
  { label: '全部', value: 3 }, 
];
const platOptions = [
  { label: '手游', value: 0 },
  { label: '端游', value: 1 },
  { label: '双端', value: 2 },
];
const serviceids=[
    { label: '纯绿护航', value: 0 },
    { label: '开挂必赔', value: 1 },
    { label: '炸单包赔', value: 2 },
    { label: '不满意包换', value: 3 },
  ]
  const caOptions = [
  { label: '普通', value: 0 },
  { label: '陪玩', value: 1 },
];
    const GoodsRoute = React.memo(({ shoptype, category, setVisibletype, 
        maplist, shopmap, setVisiblemap, difficulty, setVisibletag,
        shopmode, setVisiblemode, platform, shopplat, setVisibleplat,
setVisibleserves,tags,serves,setVisiblecommit,commitvalues,services,
shoptitleinputRef,shoptitle,bottomSafeHeight,scrollRef,setShoptitle,
shopsortinputRef,setShopsort,shopsort,shoppurchaseinputRef,
setShoplimit,shoplimit,headimages,setHeadimages,onChangeShopinfotx,
shopinfotx,setShopinfoimages,shopinfoimages,handlesubmit,setVisiblehot,
commitvalueshot,ishot,shopsales,setShopsales,shopshopsaleinputRef,
setVisiblecatype,catype,catypeindex

     }) => {

const getLabels = (values, data) => {
  return data
    .filter(item => values.includes(item.value))
    .map(item => item.label)
    .join('、');
};
  return (
    <View>
    <ScrollView contentContainerStyle={{paddingBottom:px(150)+bottomSafeHeight,paddingTop:px(0),flexGrow: 1}}
     ref={scrollRef} keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}
    overScrollMode="never" bounces={false}>
  <View style={{width: '100%',backgroundColor: '#fff',paddingHorizontal:px(16),}}>
    <TouchableOpacity style={{height: px(51),
        flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
        paddingHorizontal:px(0),
    }} onPress={()=>setVisibletype(true)}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Text style={styles.lefttitle}>商品分类</Text>
    <Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
        </View>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Text style={styles.lefttitle}>{category[shoptype].label}</Text>
          <Image source={require('../../../assets/images/my/right.png')} 
           style={{width:px(19),height:px(19)}}></Image>
    </View> 
    </TouchableOpacity>
</View>
<View style={{width: '100%',backgroundColor: '#fff',paddingHorizontal:px(16),
   // marginTop: px(8),
}}>
    <Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(0),
}} onPress={()=>setVisiblemap(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>地图</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>{maplist[shopmap].label}</Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</TouchableOpacity>
<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(0),
}} onPress={()=>setVisiblemode(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>模式</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>{difficulty[shopmode].label}</Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</TouchableOpacity>
<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(0),
}}  onPress={()=>setVisibleplat(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>平台</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>{platform[shopplat].label}</Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</TouchableOpacity>

<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(0),
}}  onPress={()=>setVisiblecatype(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>类型</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>{catype[catypeindex].label}</Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</TouchableOpacity>
</View>

<View style={{width: '100%',backgroundColor: '#fff',paddingHorizontal:px(16),
    marginTop: px(16),
}}>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}} onPress={()=>setVisibletag(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>商品标签</Text>
{/* <Text style={[styles.lefttitle,{color:'red'}]}>*</Text> */}
    </View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={[styles.lefttitle,{width: px(247),textAlign:'right'}]} 
numberOfLines={1}>{tags?.length ? tags.join('、') : '请选择'}</Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</View>
<Text style={styles.smalldes}>(限4条，可自定义)</Text>
</TouchableOpacity>

<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}}  onPress={()=>setVisibleserves(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>免费服务</Text>
{/* <Text style={[styles.lefttitle,{color:'red'}]}>*</Text> */}
    </View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={[styles.lefttitle,{width: px(247),textAlign:'right'}]} 
numberOfLines={1}>{serves?.length ? serves.join('、') : '请选择'}</Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</View>
<Text style={styles.smalldes}>(限4条，可自定义)</Text>
</TouchableOpacity>
<Line/>

<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}} onPress={()=>setVisiblecommit(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>承诺保障</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={[styles.lefttitle,{width: px(247),textAlign:'right'}]} numberOfLines={1}>
    {commitvalues?.length
    ? getLabels(commitvalues, services)
    : '请选择'}
</Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</View>
<Text style={styles.smalldes}>(限4条)</Text>
</TouchableOpacity>

<Line/>
<TouchableOpacity style={{width: '100%',height: px(51),
    flexDirection: 'column',justifyContent: 'center',
}} onPress={()=>setVisiblehot(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>商品分组</Text>
{/* <Text style={[styles.lefttitle,{color:'red'}]}>*</Text> */}
    </View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={[styles.lefttitle,{width: px(247),textAlign:'right'}]} numberOfLines={1}>
    {commitvalueshot?.length
    ? getLabels(commitvalueshot, ishot)
    : '请选择'}
</Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</View>
<Text style={styles.smalldes}>(店铺主页分组展示)</Text>
</TouchableOpacity>

</View>
 
<View style={{width: '100%',backgroundColor: '#fff',paddingHorizontal:px(16),
    marginTop: px(16),
}}> 
<TouchableOpacity style={{width: '100%',height: px(70),
    flexDirection: 'column',justifyContent: 'center',
}}   onPress={() => {
    shoptitleinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'center',}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>商品名称</Text>
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
          placeholder="请输入商品名称"
           placeholderTextColor="#AAAAAA"
            maxLength={30}
            selectionColor='#FC9026'
            multiline
            onFocus={() => {
              if (Platform.OS === 'ios') {  
                scrollRef.current?.scrollTo({
                    y: px(160),
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
    shopsortinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
          <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>排序</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
        <Text style={styles.smalldes}>(数字越小，排序越靠前)</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
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
          placeholder="请输入排序"
           placeholderTextColor="#AAAAAA"
            maxLength={8}
            selectionColor='#FC9026'
            //multiline
            keyboardType="numeric" 
            onFocus={() => {
              if (Platform.OS === 'ios') {   // 👈 只在 iOS 执行
                scrollRef.current?.scrollTo({
                    y: px(140),
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
    shoppurchaseinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
          <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>限购</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
        <Text style={styles.smalldes}>(一个用户总共能买多少，0代表无限购)</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <TextInput 
  ref={shoppurchaseinputRef}
  //textAlign='right'
           style={[styles.shopnameinput, { textAlign: 'right',width: px(200)}]}
          allowFontScaling={false}
          onChangeText={setShoplimit}
          value={shoplimit}
          selection={{
          start: shoplimit.length,
          end: shoplimit.length,
          }}
          placeholder="请输入限购数量"
           placeholderTextColor="#AAAAAA"
            maxLength={8}
            selectionColor='#FC9026'
            //multiline
            keyboardType="numeric" 
            onFocus={() => {
              if (Platform.OS === 'ios') {   // 👈 只在 iOS 执行
                scrollRef.current?.scrollTo({
                    y: px(220),
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
    shopshopsaleinputRef.current?.focus();  // 👈 拉起键盘 + 获取焦点
  }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
            <View style={{flexDirection: 'column',alignItems: 'flex-start',}}>
          <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>初始销售量</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
        <Text style={styles.smalldes}>(默认显示的销量)</Text>
            </View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <TextInput
  ref={shopshopsaleinputRef}
  //textAlign='right'
           style={[styles.shopnameinput, { textAlign: 'right',width: px(200)}]}
          allowFontScaling={false}
          onChangeText={setShopsales}
          value={shopsales}
          selection={{ 
          start: shopsales.length,
          end: shopsales.length,
          }}
          placeholder="请输入初始销售量"
           placeholderTextColor="#AAAAAA"
            maxLength={8}
            selectionColor='#FC9026'
            //multiline
            keyboardType="numeric" 
            onFocus={() => {
              if (Platform.OS === 'ios') {   // 👈 只在 iOS 执行
                scrollRef.current?.scrollTo({
                    y: px(250),
                    animated: true,
                });
                }
            }}
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
<Text style={styles.lefttitle}>轮播图</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
      <Text style={styles.smalldes}>(限1~3张，推荐393x360pt)</Text>
      <ImageUploader
        max={4}
        value={headimages}
        onChange={setHeadimages}
        />
      </View>
  </View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',
    paddingVertical:px(16),paddingHorizontal:px(16),marginTop: px(16),
}}>
<View style={{width: '100%',
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(0),
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>商品详情</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
<Text style={styles.imgsmalltx}>建议使用图片形式，长图切分为4等分上传效果最好</Text>
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
    placeholder="简单介绍下你的商品吧~"
    //keyboardType="number-pad"
    placeholderTextColor="#AAAAAA"
    maxLength={500}
    selectionColor='#FC9026'
    textAlignVertical="top"  
    onFocus={() => {
  if (Platform.OS === 'ios') {
    scrollRef.current?.scrollToEnd({ animated: true });
  }
  }}
    />
    </View>

<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <Text style={styles.count}>
        {shopinfotx?.length||0}
      </Text>
      <Text style={styles.countf}>/500</Text>
</View>
</View>
      <ImageUploader
        max={10}
        value={shopinfoimages}
        onChange={setShopinfoimages}
        />
</View>

    </ScrollView>

<View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),
    alignItems: 'center',gap:px(3)}}>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
    gap:px(21)
}}>
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

  );
    }); 
    const SkusRoute = React.memo(({
setEditIndex,setSkuForm,setSkuModalVisible,skuList,setSkuList,
handledeletesku,
     }) => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: px(0) }}
    >
    <View style={{width: '100%',backgroundColor: '#fff',
        paddingTop:px(12),paddingHorizontal:px(16),marginTop: px(8),}}>
    <View style={{width: '100%',flexDirection: 'row',
        alignItems: 'center',justifyContent: 'space-between',
        marginTop: px(0),
    }}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Text style={styles.lefttitle}>服务套餐</Text>
    <Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
        </View>
    <Text style={styles.lefttitle}>请为商品搭配套餐</Text>
    </View>
    <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
        marginTop: px(12),paddingBottom:px(12)
    }}>
    <TouchableOpacity style={{width: px(345),height: px(47),backgroundColor: '#F2F3F5',
        borderRadius: px(8),borderWidth: px(1),borderColor: '#FF9500',
        flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
    }}  onPress={() => {
        setEditIndex(-1); // 👈 新增模式
        setSkuForm({
          title: '',
          content: '',
          stock: '',
          price: '',
        });
        setSkuModalVisible(true);
      }}>
    <Image source={require('../../../assets/images/my/addshop.png')} 
        style={{width:px(18),height:px(18)}}></Image>
    </TouchableOpacity>
    </View>
    
    {skuList.map((item, index) => (
      <View key={item.id} style={styles.skuItem}>
        {/* 左侧：标题（点击编辑） */}
        <TouchableOpacity
          style={{ flex: 1,flexDirection: 'row',alignItems: 'center',
            justifyContent: 'space-between',
           }}
          onPress={() => {
            setEditIndex(index);
            setSkuForm(item);
            setSkuModalVisible(true);
          }}
        >
          <Text style={[styles.skuTitle,{width: px(200),}]} numberOfLines={1}>{item.title}</Text>
           <Text style={[styles.skuTitle,{marginRight: px(16),}]}>¥{item.price}</Text>
        </TouchableOpacity>
        {/* 右侧：操作区 */}
        <View style={styles.skuActions}>
    
          {/* 编辑按钮 */}
          <TouchableOpacity
            onPress={() => {
              setEditIndex(index);
              setSkuForm(item);
              setSkuModalVisible(true);
            }}
          >
            <Text style={styles.editText}>编辑</Text>
          </TouchableOpacity>
          {/* 删除按钮 */}
          <TouchableOpacity
            onPress={() => {
              handledeletesku(item)
              //const updated = skuList.filter(i => i.id !== item.id);
              //setSkuList(updated);
            }}
          >
            <Text style={styles.deleteText}>删除</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))}
    </View>
    </ScrollView>
  );
   });
   const AddonsRoute = React.memo(({
setAddonEditIndex,setAddonForm,setAddonModalVisible,addonList,
setAddonList,handledeleteaddon,
     }) => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: px(0) }}
    >
<View style={{width: '100%',backgroundColor: '#fff',
    paddingTop:px(12),paddingHorizontal:px(16),marginTop: px(8),
}}>
<View style={{width: '100%',
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(0),
}}>
<Text style={styles.lefttitle}>增值服务</Text>
<Text style={styles.lefttitle}>其他收费服务</Text>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
    marginTop: px(12),paddingBottom:px(12)
}}>
<TouchableOpacity style={{width: px(345),height: px(47),backgroundColor: '#F2F3F5',
    borderRadius: px(8),borderWidth: px(1),borderColor: '#FF9500',
    flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
}}     onPress={() => {
      setAddonEditIndex(-1);
      setAddonForm({
        content: '',
        price: '',
        stock: '',
      });
      setAddonModalVisible(true);
    }}>
<Image source={require('../../../assets/images/my/addshop.png')} 
    style={{width:px(18),height:px(18)}}></Image>
</TouchableOpacity>
</View>

{addonList.map((item, index) => (
  <View key={item.id} style={styles.skuItem}>

    {/* 内容 */}
    <TouchableOpacity
       style={{ flex: 1,flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',
       }}
      onPress={() => {
        setAddonEditIndex(index);
        setAddonForm(item);
        setAddonModalVisible(true);
      }}
    >
       <Text style={[styles.skuTitle,{width: px(200),}]} numberOfLines={1}>{item.content}</Text>
       <Text style={[styles.skuTitle,{marginRight: px(16),}]}>¥{item.price}</Text>
    </TouchableOpacity>

    {/* 操作 */}
    <View style={styles.skuActions}>
      <TouchableOpacity
        onPress={() => {
          setAddonEditIndex(index);
          setAddonForm(item);
          setAddonModalVisible(true);
        }}
      >
        <Text style={styles.editText}>编辑</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          handledeleteaddon(item)
          //setAddonList(addonList.filter(i => i.id !== item.id));
        }}
      >
        <Text style={styles.deleteText}>删除</Text>
      </TouchableOpacity>
    </View>

  </View>
))}
</View>
    </ScrollView>
  );
   });
export default function ShopEdit({ navigation,route }) {
  const triggerShopManageRefresh = useAuthStore(
  (state) => state.triggerShopManageRefresh
);
      const [routes] = useState([
        { key: 'Goods', title: '商品详情' },
        { key: 'Skus', title: '服务套餐' },
        { key: 'Addons', title: '增值服务' },
      ]);
    const {shopinfo}=route.params||{}
  const layout = useWindowDimensions();
     const insets = useSafeAreaInsets();
      const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
  const [shoptitle, setShoptitle] = useState(''); //商品标题
   const [shopsort, setShopsort] = useState('0'); //商品排序
  const [shoplimit, setShoplimit] = useState('0'); //商品限购
   const [shopsales, setShopsales] = useState('0'); //商品初始销量
const scrollRef = React.useRef(null);
const shoptitleinputRef = React.useRef(null); //商品标题
const shopsortinputRef = React.useRef(null); //商品排序
const shoppurchaseinputRef = React.useRef(null); //商品限购
const shopshopsaleinputRef = React.useRef(null); //商品初始销量
const [headimages, setHeadimages] = useState([]); //头图列表
const [shopinfoimages, setShopinfoimages] = useState([]); //商品详情图片
const [skuList, setSkuList] = useState([]); //sku
const [skuModalVisible, setSkuModalVisible] = useState(false);
const [editIndex, setEditIndex] = useState(-1); // 👈 当前编辑下标
const [skuForm, setSkuForm] = useState({
  title: '',
  content: '',
  minStock: '',
  price: '',
  originPrice: '',
  stock: '',
});
const [addonList, setAddonList] = useState([]); // 增值内容列表
const [addonModalVisible, setAddonModalVisible] = useState(false);
const [addonEditIndex, setAddonEditIndex] = useState(-1);
const [addonForm, setAddonForm] = useState({
  content: '',
  price: '',
  stock: '',
  id:''
});
const [shopinfotx, setShopinfotx] = useState(""); //商品详情
    const [shoptype, setShoptype] = useState(0); //商品分类
    const [visibletype, setVisibletype] = useState(false) //商品分类弹窗开关
    const [shopmap, setShopmap] = useState(0); //商品地图
    const [visiblemap, setVisiblemap] = useState(false) //商品地图弹窗开关
    const [shopmode, setShopmode] = useState(0); //商品模式
    const [visiblemode, setVisiblemode] = useState(false) //商品模式弹窗开关
    const [shopplat, setShopplat] = useState(0); //商品平台
    const [visibleplat, setVisibleplat] = useState(false) //商品平台弹窗开关
const [visiblecommit, setVisiblecommit] = useState(false); //承诺保障开关
const [commitvalues, setCommitvalues] = useState<(number | string)[]>([]); //承诺保障内容
const [visibletag, setVisibletag] = useState(false); //商品标签弹窗开关
const [tags, setTags] = useState(['24小时服务','情绪价值拉满','售后无忧','不卡保底','王牌双护']); //商品标签
const [visibleserves, setVisibleserves] = useState(false); //商品标签弹窗开关
const [serves, setServes] = useState(['全图物资优先', '包通所有道卡', '免费开所有桥']); //商品标签
const [category, setCategory] = useState(typeOptions); //商品分类列表
const [platform, setPlatform] = useState(platOptions); //平台列表
const [maplist, setMaplist] = useState(mapOptions); //地图列表
const [difficulty, setDifficulty] = useState(modeOptions); //难度列表
const [services, setServices] = useState(serviceids); //承诺保障
const [index, setIndex] = useState(0); //tabs
const [toastApi, contextHolder] = Toast.useToast();
const [hotlist, setHotlist] = useState(ishot); //热销、新品、推荐
const [visiblehot, setVisiblehot] = useState(false); //热销、新品、推荐开关
const [commitvalueshot, setCommitvalueshot] = useState<(number | string)[]>([0]); //热销、新品、推荐内容
const [catype, setCatype] = useState(caOptions); //陪玩、普通
const [visiblecatype, setVisiblecatype] = useState(false) //分类弹窗开关
const [catypeindex, setCatypeindex] = useState(0); //分类弹窗下标
const [categorygame, setCategorygame] = useState(gameOptions); //游戏分类列表
const [visibletypegame, setVisibletypegame] = useState(false) //游戏分类弹窗开关
const [shoptypegame, setShoptypegame] = useState(0); //游戏分类
const [categoryall, setCategoryall] = useState(typeOptions); //所有商品分类列表



  const handleback = () => {  //返回上一页
    navigation.goBack(); 
    };
    const renderTabBar = useCallback(
        ({ navigationState, jumpTo }) => {
          const scrollRef = useRef(null);
          const scrollViewWidthRef = useRef(0);
          const TAB_WIDTH = px(88);
    
          useEffect(() => {
            const currentIndex = navigationState.index;
    
            if (scrollRef.current && scrollViewWidthRef.current > 0) {
              const offset =
                currentIndex * TAB_WIDTH -
                scrollViewWidthRef.current / 2 +
                TAB_WIDTH / 2;
    
              scrollRef.current.scrollTo({
                x: Math.max(0, offset),
                animated: true,
              });
            }
          }, [navigationState.index]);

          return (
            <View>
              <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
                onLayout={(e) => {
                  scrollViewWidthRef.current =
                    e.nativeEvent.layout.width;
                }}
              >
                {navigationState.routes.map((route, idx) => {
                  const isActive = navigationState.index === idx;
    
                  return (
                    <TouchableOpacity
                      key={route.key}
                      style={{
                        height: px(53),
                        width: TAB_WIDTH,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => jumpTo(route.key)}
                    >
                      <Text
                        style={{
                          fontFamily: isActive
                            ? 'MiSans-Medium'
                            : 'MiSans-Regular',
                          color: isActive ? '#FF9500' : '#1A1A1A',
                          fontSize: px(14),
                        }}
                      >
                        {route.title}
                      </Text>
    
                      {isActive && (
                        <View
                          style={{
                            position: 'absolute',
                            bottom: px(10),
                            height: px(4),
                            width: px(22),
                            backgroundColor: '#FF9500',
                            borderRadius: px(20),
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          );
        },
        []
    );
    useEffect(() => {
    if(shopinfo){
        console.log(shopinfo);
        getdefaultinfo(shopinfo)
        getskulist(shopinfo)
        getAddonList(shopinfo)
    }
    }, [shopinfo])

    const getdefaultinfo = async(e) => {  //获取初始商品信息
        try {
          const response = await request({
            url: '/store/goods/detail',
            method: 'GET',
            data:{},
            query: {id:e.id}
          });
          console.log('shopinfo123',response);
         if(response.data!==undefined&&response.code==0){
         let goodres=response.data.goods
         let skulist=response.data.skus
         console.log(goodres);
          const map = ['isHot', 'isNew', 'isRecommend'];
          const result = map
            .map((key, index) => goodres[key] ? index : -1)
            .filter(index => index !== -1);
          setCommitvalueshot(result)
          console.log(result);


         setShoptitle(goodres.title)
         setShopsort(String(goodres.sortWeight))
         setShoplimit(String(goodres.userLimit))
         console.log('goodsattr',goodres.attr);
         
         if(goodres.attr){
          console.log(JSON.parse(goodres.attr)?.virtualSales);
          let config=JSON.parse(goodres.attr)
         setShopsales(String(config?.virtualSales)) //设置初始销量
         if(config.isplayer){
         setCatypeindex(config.isplayer)
         }
         }else{
          setShopsales('0')
         }

setShopplat(getIndexByLabel(goodres.platform,platform)) //设置平台
setShopmode(getIndexByLabel(goodres.difficulty,difficulty)) //设置难度
setShopmap(getIndexByLabel(goodres.map,maplist)) //地图
setShoptype(getIndexById(goodres.categoryId,category)) //分类
const productarr = goodres.productTag.split(',');
const freeservicearr = goodres.freeService.split(',');
setTags(productarr) //商品标签
setServes(freeservicearr) //免费服务
setCommitvalues(getIndexesByLabels(goodres.serviceIds, services)) //承诺保障
setShopinfotx(goodres.content)
//console.log(commitvalues, services); 
//console.log(getIndexesByLabels(goodres.serviceIds, services));
//console.log(getIndexById(goodres.categoryId,category));
//console.log(headimages,getImageArray(goodres.coverImage, ""));
setHeadimages(getImageArray(goodres.coverImage, IMG_URL))
setShopinfoimages(getImageArray(goodres.images, IMG_URL))
// console.log(skulist);
// if(skulist!==null){
// const result = skulist.map(item => ({
//   id: String(item.id),                // id 转字符串
//   title: item.title,                  // title → title
//   content: item.subTitle || "",       // subTitle → content
//   minStock: String(item.guarantee ?? ""), // guarantee → minStock
//   price: String(item.price / 100),    // 分转元（9900 → 99）
//   originPrice: String(item.originalPrice / 100), // 同上
//   stock: String(item.quantity),       // quantity → stock
// }));
// setSkuList(result)
// console.log(result);
// }




         }
        } catch (error) {
          console.error(error);
        }
     };
     const getskulist = async(e) => {  //获取sku列表
        try {
          const response = await request({
            url: '/store/goods/detail',
            method: 'GET',
            data:{},
            query: {id:e.id}
          });
          console.log(response);
         if(response.data!==undefined&&response.code==0){
         let skulist=response.data.skus
        if(skulist!==null){
        const result = skulist.map(item => ({
          id: String(item.id),                // id 转字符串
          title: item.title,                  // title → title
          content: item.subTitle || "",       // subTitle → content
          minStock: String(item.guarantee ?? ""), // guarantee → minStock
          price: String(item.price / 100),    // 分转元（9900 → 99）
          originPrice: String(item.originalPrice / 100), // 同上
          stock: String(item.quantity),       // quantity → stock
        }));
        setSkuList(result)
        console.log(result);
        }

         }
        } catch (error) {
          console.error(error);
        }
      }
      const getAddonList = async(e) => {  //获取增值服务
        //return
        try {
          const response = await request({
            url: '/store/goods/detail',
            method: 'GET',
            data:{},
            query: {id:e.id}
          });
          console.log(response);
         if(response.data!==undefined&&response.code==0){
         let addonslist=response.data.addons
         console.log(addonslist);
        if(addonslist!==null){
        const result = addonslist.map(item => ({
          id: String(item.id),                // id 转字符串
          content: item.title,                  // title → title
          //content: item.subTitle || "",       // subTitle → content
          minStock: String(item.guarantee ?? ""), // guarantee → minStock
          price: String(item.price / 100),    // 分转元（9900 → 99）
          //originPrice: String(item.originalPrice / 100), // 同上
          stock: String(item.quantity),       // quantity → stock
        }));
        setAddonList(result)
        console.log(result);
        }

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
}
type ItemType = {
  label: string;
  value: number;
};

const getIndexesByLabels = (
  text: string,
  data: ItemType[]
): number[] => {
  if (!text) return [];

  const labels = text.split(',').map(item => item.trim());

  const indexes = labels
    .map(label => data.findIndex(item => item.label === label))
    .filter(index => index !== -1)
    .sort((a, b) => a - b);

  return indexes;
};
const getIndexById = <T extends { id: number }>(
  id: number,
  data: T[]
): number => {
  const index = data.findIndex(item => item.id === id);
  return index !== -1 ? index : 0;
};
const getIndexByLabel = <T extends { label: string }>(
  label: string,
  data: T[]
): number => {
  const index = data.findIndex(
    item => item.label.trim() === label.trim()
  );

  return index !== -1 ? index : 0;
};
    useEffect(() => {
       initPage(); //获取分类列表
       //getcategorytree(); //获取默认值
    }, [])
    const initPage = async () => {
  await Promise.all([
    getcategory(),
    //getcategorytree(),
  ]);

  if (shopinfo) {
    await getdefaultinfo(shopinfo);
  }
};
    const getcategory = async() => { 
            try {
              const response = await request({
                url: '/category/tree',
                method: 'GET',
                data:{},
                query: {}
              });
              console.log('category/tree1',response);
             if(response.data!==undefined&&response.code==0){
      const secondCategoryMap = response.data.reduce((prev,item,index)=>{
        prev[index] = (item.children || []).map((child,childIndex)=>({
          label: child.name,
          value: childIndex,
          id: child.id,
        }));
        return prev;
      },{});
      console.log(secondCategoryMap);
      const firstCategory = response.data.map((item,index)=>({
        label:item.name,
        value:index,
        id:item.id
      }));
      const childId = shopinfo.categoryId;
      const parentId = response.data
      .find(parent =>
        parent.children?.some(child => child.id === childId)
      )?.id;
      getcategorytree(parentId)
      console.log('parentId',parentId);
      console.log('一级分类:',firstCategory);
      //getcategorytree(firstCategory[0].id);
      setCategorygame(firstCategory)
      setCategory(secondCategoryMap[0])
      setCategoryall(secondCategoryMap)
      }
      } catch (error) {
        console.error(error);
      }
     };
     const getcategorytree = async(e) => { 
            try {
              const response = await request({
                url: '/category/attribute/by-category',
                method: 'GET',
                data:{},
                query: {categoryId:e}
              });
              console.log(response);
             if(response.data!==null&&response.code==0&&response.data!==undefined){
              const res=response.data
              for(let i=0;i<res.length-1;i++){
               if(res[i].attrKey=="platform"){
                console.log(res[i]);
                let str=res[i].options
                const platOptions = JSON.parse(str).map((item, index) => ({
                  label: item,
                  value: index
                }));
                setPlatform(platOptions)
                console.log(platOptions);
               }else if(res[i].attrKey=="map"){
               let str=res[i].options
               const mapOptions = JSON.parse(str).map((item, index) => ({
                  label: item,
                  value: index
                }));
                setMaplist(mapOptions)
                console.log(mapOptions);
               }else if(res[i].attrKey=="difficulty"){
               let str=res[i].options
               const mapOptions = JSON.parse(str).map((item, index) => ({
                  label: item,
                  value: index
                }));
               setDifficulty(mapOptions)
               }else if(res[i].attrKey=="productTag"){
               let str=res[i].options
               const arr = JSON.parse(str);
               //setTags(arr)
               //setTags(res[i].options) 
               }else if(res[i].attrKey=="freeService"){
                let str=res[i].options
               const arr = JSON.parse(str);
               //setServes(arr)
               }else if(res[i].attrKey=="serviceIds"){
               let str=res[i].options
               const serviceOptions = JSON.parse(str).map((item, index) => ({
                  label: item,
                  value: index
                }));
               setServices(serviceOptions)
               }
              }
             }
            } catch (error) {
              console.error(error);
            }
      };
      function checkExist(arr, value) {
  return arr.includes(value) ? 1 : 0;
}
const handlesubmit = async() => {  //保存
 console.log(shopinfo.id);
  console.log(category[shoptype].id); //分类
 console.log(platform[shopplat]); //平台
 console.log(maplist[shopmap]); //地图
 console.log(difficulty[shopmode]); //难度
 console.log(tags.join(',')); //商品标签
 console.log(serves.join(',')); //免费服务
 console.log(getLabelsd(commitvalues, services)); //承诺保障
 console.log(shoptitle); //商品名称
 console.log(shopsort); //商品排序
 console.log(shoplimit); //商品限购
 console.log(headimages); //轮播图
 console.log(shopinfotx); //商品详情文本
 console.log(shopinfoimages); //商品详情图片
 if(getLabelsd(commitvalues, services)==""){
   Toast.show({
    content: '请选择承诺保障',
    duration: 2,
    position: 'center',
    mask: false,
  })
  return
 }
  if(shoptitle==""){
   Toast.show({
    content: '请填写商品名称',
    duration: 2,
    position: 'center',
    mask: false,
  })
  return
 }
   if(shopsort==""){
   Toast.show({
    content: '请填写商品排序',
    duration: 2,
    position: 'center',
    mask: false,
  })
  return
 }
    if(shoplimit==""){
   Toast.show({
    content: '请填写商品限购数量',
    duration: 2,
    position: 'center',
    mask: false,
  })
  return
 }
      if(shopsales==""){
    Toast.show({
     content: '请填写商品初始销售量',
     duration: 2,
     position: 'center',
     mask: false,
   })
   return
  }
  if(headimages.length==0){
   Toast.show({
    content: '请上传轮播图',
    duration: 2,
    position: 'center',
    mask: false,
  })
  return
 }
  if(shopinfotx==""){
   Toast.show({
    content: '请填写商品详情',
    duration: 2,
    position: 'center',
    mask: false,
  })
  return
 }
   Toast.loading({
    content: '上传中',
    mask: true,
    duration: 0,
  })
const finalStr = await handleUploadAndFormat(headimages);
const finaimgStr = await handleUploadAndFormat(shopinfoimages);

console.log(finalStr);
console.log(finaimgStr);
console.log('处理完成');
Toast.removeAll()
handleaddshop(finalStr,finaimgStr) //正式提交

};
const handleaddshop = async(finalStr,finaimgStr) => { 
  console.log(checkExist(commitvalueshot, 0));
  console.log(checkExist(commitvalueshot, 1));
  console.log(checkExist(commitvalueshot, 2));
  //return
    const att = {
    virtualSales: Number(shopsales),
    isplayer: catype[catypeindex].value,
  };
try {
const response = await request({
  url: '/store/goods/spu/update',
  method: 'PUT',
  data: {
    id: shopinfo.id,
    categoryId: category[shoptype].id,
    title: shoptitle,
    content: shopinfotx,
    coverImage: finalStr,
    images: finaimgStr,
    platform:platform[shopplat].label,
    map: maplist[shopmap].label,
    difficulty: difficulty[shopmode].label,
    productTag: tags.join(','),
    freeService: serves.join(','),
    serviceIds: getLabelsd(commitvalues, services),
    maxBuy: 0,
    userLimit: Number(shoplimit),
    sortWeight: Number(shopsort),
    isHot: checkExist(commitvalueshot, 0),
    isNew: checkExist(commitvalueshot, 1),
    isRecommend: checkExist(commitvalueshot, 2),
    attr: JSON.stringify(att)
    },
   query: {},
    }); 
        console.log('address',response);
      if (response.data !== null && response.code == 0) {
       Toast.success({content: '保存成功',mask:false,duration:2})
       triggerShopManageRefresh();
       //handleback();
      }
      } catch (error) {
      Toast.fail('保存失败') 
      console.error('保存失败',error);
      }
 }
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
const getLabelsd = (values, data) => {
  return data
    .filter(item => values.includes(item.value))
    .map(item => item.label)
    .join(',');
};
const onChangeShopinfotx = (e) => {  //修改商品详情
    console.log(e);
    setShopinfotx(e)
};
  const renderScene = ({ route }) => {
  switch (route.key) {
    case 'Goods':
      return (
          <GoodsRoute
          shoptype={shoptype}
          category={category}
          setVisibletype={setVisibletype}
          maplist={maplist}
          shopmap={shopmap}
          setVisiblemap={setVisiblemap}
          difficulty={difficulty}
          shopmode={shopmode}
          setVisiblemode={setVisiblemode}
          platform={platform}
          shopplat={shopplat}
          setVisibleplat={setVisibleplat}
          setVisibletag={setVisibletag}
          setVisibleserves={setVisibleserves}
          tags={tags}
          serves={serves}
          setVisiblecommit={setVisiblecommit}
          commitvalues={commitvalues}
          services={services}
          shoptitleinputRef={shoptitleinputRef}
          shoptitle={shoptitle}
          bottomSafeHeight={bottomSafeHeight}
          scrollRef={scrollRef}
          setShoptitle={setShoptitle}
          shopsortinputRef={shopsortinputRef}
          setShopsort={setShopsort}
          shopsort={shopsort}
          shoppurchaseinputRef={shoppurchaseinputRef}
          shopshopsaleinputRef={shopshopsaleinputRef}
          setShoplimit={setShoplimit}
          setShopsales={setShopsales}
          shoplimit={shoplimit}
          shopsales={shopsales}
          headimages={headimages}
          setHeadimages={setHeadimages}
          onChangeShopinfotx={onChangeShopinfotx}
          shopinfotx={shopinfotx}
          shopinfoimages={shopinfoimages}
          setShopinfoimages={setShopinfoimages}
          handlesubmit={handlesubmit}
          setVisiblehot={setVisiblehot}
          commitvalueshot={commitvalueshot}
          ishot={ishot}
          setVisiblecatype={setVisiblecatype}
          catype={catype}
          catypeindex={catypeindex}
        />
      );
    case 'Skus':
      return (
      <SkusRoute 
      setEditIndex={setEditIndex}
      setSkuForm={setSkuForm}
      setSkuModalVisible={setSkuModalVisible}
      skuList={skuList}
      setSkuList={setSkuList}
      handledeletesku={handledeletesku}
      />
    );
    case 'Addons':
      return (
      <AddonsRoute 
      setAddonEditIndex={setAddonEditIndex}
      setAddonForm={setAddonForm}
      setAddonModalVisible={setAddonModalVisible}
      addonList={addonList}
      setAddonList={setAddonList}
      handledeleteaddon={handledeleteaddon}
      />
    );
    default:
      return null;
  }
};

const handleSaveSku = () => { //编辑、修改、保存sku
  console.log(skuList);
  
  const title = (skuForm.title || '').trim();
  const minStock = (skuForm.minStock || '').trim();
  const price = (skuForm.price || '').trim();
  const originPrice = (skuForm.originPrice || '').trim();
  const stock = (skuForm.stock || '').trim();

  // 正则
  const intReg = /^[1-9]\d*$/; // 大于0整数
  const priceReg = /^(?:0|[1-9]\d*)(\.\d{1,2})?$/; // 最多两位小数
  const reg = /^(0|[1-9]\d*)$/; // 0 或 正整数
  // 标题
  if (!title) {
      toastApi.show({
    content: '请输入标题',
    duration: 2,
    position: 'center',
    mask: false,
  });
  return 
  }

  // 保底
  if (minStock && !reg.test(minStock)) {
     toastApi.show({
    content: '保底必须为大于0的整数',
    duration: 2,
    position: 'center',
    mask: false,
  });
   return 
  }

  // 销售价
  if (!price) {
       toastApi.show({
    content: '请输入销售价',
    duration: 2,
    position: 'center',
    mask: false,
  });
      return 
  }

  if (!priceReg.test(price) || parseFloat(price) <= 0) {
     toastApi.show({
    content: '销售价必须大于0，且最多两位小数',
    duration: 2,
    position: 'center',
    mask: false,
  });
      return 
  }

  // 划线价
  if (originPrice) {
    if (!priceReg.test(originPrice) || parseFloat(originPrice) <= 0) {
    toastApi.show({
    content: '划线价必须大于0，且最多两位小数',
    duration: 2,
    position: 'center',
    mask: false,
  });
      return 
    }

    if (parseFloat(originPrice) <= parseFloat(price)) {
    toastApi.show({
    content: '划线价必须大于销售价',
    duration: 2,
    position: 'center',
    mask: false,
  });
      return 
    }
  }

  // 库存
  if (stock && !intReg.test(stock)) {
    toastApi.show({
    content: '库存必须为大于0的整数',
    duration: 2,
    position: 'center',
    mask: false,
  });
      return 
  }

  // 默认值处理
  const finalData = {
    ...skuForm,
    title,
    minStock: minStock || '',
    price,
    originPrice: originPrice || '',
    stock: stock || '999',
  };

  if (editIndex > -1) {  //更新sku
    console.log(editIndex,finalData);
    editsku(finalData)
    //const updated = [...skuList];
    //updated[editIndex] = finalData;
    //setSkuList(updated);
  } else {  //添加sku
    addsku(finalData)
    setSkuList(prev => [
      ...prev,
      { ...finalData, id: Date.now().toString() },
    ]);
  }

  setSkuModalVisible(false);
};
const editsku = async(e) => { 
console.log(e,Number(e.price)*100);
//return
try {
const response = await request({
  url: '/store/goods/sku/update',
  method: 'PUT',
  data: {
  id: Number(e.id),
  title: e.title,
  subTitle: e.content,
  code: "",
  price: Number(e.price)*100,
  image: "",
  originalPrice: Number(e.originPrice)*100,
  quantity: Number(e.stock),
  guarantee: Number(e.minStock),
  specs: "",
  sortWeight: 0,
  virtualSales: 0,
  attr: ""
    },
   query: {},
    }); 
        console.log('address',response);
      if (response.data !== null && response.code == 0) {
      Toast.success({content: '保存成功',mask:false})
      getskulist(shopinfo)
      }
      } catch (error) {
      Toast.fail({content: '保存失败',mask:false})
      //Toast.fail('保存失败') 
      console.error('保存失败',error);
      }
 };
 const addsku = async(e) => { //添加sku
console.log(e,Number(e.price)*100,shopinfo);
//return
try {
const response = await request({
  url: '/store/goods/sku/add',
  method: 'POST',
  data: {
  goodsId:shopinfo.id,
  //id: Number(e.id),
  title: e.title,
  subTitle: e.content,
  code: "",
  price: Number(e.price)*100,
  image: "",
  originalPrice: Number(e.originPrice)*100,
  quantity: Number(e.stock),
  guarantee: Number(e.minStock),
  specs: "",
  sortWeight: 0,
  virtualSales: 0,
  attr: ""
    },
   query: {},
    }); 
        console.log('address',response);
      if (response.data !== null && response.code == 0) {
      Toast.success({content: '保存成功',mask:false})
      getskulist(shopinfo)
      }
      } catch (error) {
      Toast.fail({content: '保存失败',mask:false})
      //Toast.fail('保存失败') 
      console.error('保存失败',error);
      }
 };
  const handledeletesku = (e) => { //删除确认弹窗
    Modalitem.alert('提示', '是否删除？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handledelete(e),
       style: { color: '#FC9026' },
       },   
    ])
  };
 const handledelete = async(e) => { //删除sku
 console.log(e);
 try {
const response = await request({
  url: '/store/goods/sku/delete',
  method: 'DELETE',
  data: {
    },
   query: {id:e.id},
    }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0) {
      Toast.success({content: '删除成功',mask:false})
      getskulist(shopinfo)
      }
      } catch (error) {
      Toast.fail({content: '删除失败',mask:false})
      //Toast.fail('保存失败') 
      console.error('删除失败',error);
      }
  };
const handleSaveAddon = () => { //保存、编辑、增值服务
  const content = (addonForm.content || '').trim();
  const price = (addonForm.price || '').trim();
  const stock = (addonForm.stock || '').trim();
  const id = (addonForm.id || '').trim();
  // 正则
  const intReg = /^[1-9]\d*$/; // 大于0整数
  const priceReg = /^(?:0|[1-9]\d*)(\.\d{1,2})?$/; // 最多两位小数

  // 内容
  if (!content) {
      toastApi.show({
    content: '请输入内容',
    duration: 2,
    position: 'center',
    mask: false,
  });
  return 
  }

  // 销售价
  if (!price) {
    toastApi.show({
    content: '请输入销售价',
    duration: 2,
    position: 'center',
    mask: false,
  });
  return 
  }

  if (!priceReg.test(price) || parseFloat(price) <= 0) {
    toastApi.show({
    content: '销售价必须大于0，且最多两位小数',
    duration: 2,
    position: 'center',
    mask: false,
  });
  return 
  }

  // 库存
  if (stock && !intReg.test(stock)) {
    toastApi.show({
    content: '库存必须为大于0的整数',
    duration: 2,
    position: 'center',
    mask: false,
  });
  return 
  }

  const newItem = {
    ...addonForm,
    content,
    price,
    stock: stock || '999',
    id
  };

  if (addonEditIndex > -1) { //编辑增值服务
    console.log(newItem);
    editaddon(newItem)
    // const list = [...addonList];
    // list[addonEditIndex] = {
    //   ...newItem,
    //   id: addonList[addonEditIndex].id,
    // };
    // setAddonList(list);
  } else { //新增增值服务
    addaddon(newItem)
    //setAddonList(prev => [...prev, newItem]);
  }
  setAddonModalVisible(false);
};
const editaddon = async(e) => { 
console.log(e,Number(e.price)*100);
//return
try {
const response = await request({
  url: '/store/goods/addon/update',
  method: 'PUT',
  data: {
  id: Number(e.id),
  title: e.content,
  subTitle: "",
  price: Number(e.price)*100,
  priceType: "FIXED",
  quantity: Number(e.stock),
  maxQuantity: 0,
  isOptional: 0,
  sortWeight: 0,
  extraInfo: ""
  },
   query: {},
    }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0) {
      Toast.success({content: '保存成功',mask:false})
      getAddonList(shopinfo)
      }
      } catch (error) {
      Toast.fail({content: '保存失败',mask:false})
      //Toast.fail('保存失败') 
      console.error('保存失败',error);
      }
 };
 const addaddon = async(e) => { //添加sku
console.log(e,Number(e.price)*100,shopinfo);
//return
try {
const response = await request({
  url: '/store/goods/addon/add',
  method: 'POST',
  data: {
  goodsId:shopinfo.id,
  //id: Number(e.id),
  title: e.content,
  subTitle: "",
  price: Number(e.price)*100,
  priceType: "FIXED",
  quantity: Number(e.stock),
  maxQuantity: 0,
  isOptional: 0,
  sortWeight: 0,
  extraInfo: ""
    },
   query: {},
    }); 
        console.log('address',response);
      if (response.data !== null && response.code == 0) {
      Toast.success({content: '保存成功',mask:false})
      getAddonList(shopinfo)
      }
      } catch (error) {
      Toast.fail({content: '保存失败',mask:false})
      //Toast.fail('保存失败') 
      console.error('保存失败',error);
      }
 };
  const handledeleteaddon = (e) => { //删除确认弹窗
    Modalitem.alert('提示', '是否删除？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handleaddondelete(e),
       style: { color: '#FC9026' },
       },   
    ])
  };
 const handleaddondelete = async(e) => { //删除sku
 console.log(e);
 try {
const response = await request({
  url: '/store/goods/addon/delete',
  method: 'DELETE',
  data: {
    },
   query: {id:e.id},
    }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0) {
      Toast.success({content: '删除成功',mask:false})
      getAddonList(shopinfo)
      }
      } catch (error) {
      Toast.fail({content: '删除失败',mask:false})
      //Toast.fail('保存失败') 
      console.error('删除失败',error);
      }
  };
  return (
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
           <Text style={styles.title}>商品编辑</Text>
               </View>
             </View>
    <TabView
    navigationState={{ index, routes }}
    renderScene={renderScene}
    onIndexChange={setIndex}
    initialLayout={{ width: layout.width }}
    renderTabBar={renderTabBar}
    lazy
    />
<TextRadioModal
      visible={visibletype}
      onClose={() => setVisibletype(false)}
      data={category}
      value={shoptype}
      onConfirm={(val) => {
        setShoptype(val);
        setVisibletype(false);
      }}
    /> 
    <TextRadioModal
      visible={visiblemap}
      onClose={() => setVisiblemap(false)}
      data={maplist}
      value={shopmap}
      onConfirm={(val) => {
        setShopmap(val);
        setVisiblemap(false);
      }}
    />
    <TextRadioModal
      visible={visiblemode}
      onClose={() => setVisiblemode(false)}
      data={difficulty}
      value={shopmode}
      onConfirm={(val) => {
        setShopmode(val);
        setVisiblemode(false);
      }}
    />
    <TextRadioModal
      visible={visibleplat}
      onClose={() => setVisibleplat(false)}
      data={platform} 
      value={shopplat}
      onConfirm={(val) => {
        setShopplat(val);
        setVisibleplat(false);
      }}
    />
    <TextRadioModal
      visible={visiblecatype}
      onClose={() => setVisiblecatype(false)}
      data={catype} 
      value={catypeindex}
      onConfirm={(val) => {
        setCatypeindex(val);
        setVisiblecatype(false);
      }}
    />
     <TagInputModal
     title={'商品标签'}
      visible={visibletag}
      onClose={() => setVisibletag(false)}
      defaultValue={tags}
      onConfirm={(list) => setTags(list)}
     />
       <TagInputModal
       title={'免费服务'}
       visible={visibleserves}
       onClose={() => setVisibleserves(false)}
       defaultValue={serves}
       onConfirm={(list) => setServes(list)}
      />
      <TextCheckboxModal
        visible={visiblecommit}
        onClose={() => setVisiblecommit(false)}
        data={services}
        value={commitvalues}
        onConfirm={(val) => {
          setCommitvalues(val);
          setVisiblecommit(false);
        }}
       />
        <TextCheckboxModal
         visible={visiblehot}
         onClose={() => setVisiblehot(false)}
         data={hotlist}
         value={commitvalueshot}
         onConfirm={(val) => {
           setCommitvalueshot(val);
           setVisiblehot(false);
         }}
        />
       <SkuModal
         visible={skuModalVisible}
         editIndex={editIndex}
         skuForm={skuForm}
         setSkuForm={setSkuForm}
         handleSaveSku={handleSaveSku}
         setSkuModalVisible={setSkuModalVisible}
         styles={styles}
         contextHolder={contextHolder}
       /> 
       <AddonModal
         visible={addonModalVisible}
         addonEditIndex={addonEditIndex}
         addonForm={addonForm}
         setAddonForm={setAddonForm}
         handleSaveAddon={handleSaveAddon}
         setAddonModalVisible={setAddonModalVisible}
         styles={styles}
         contextHolder={contextHolder}
       />
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
          canneltx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(20),
    },
    cannelbox:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: px(170),
        height: px(38),
        borderRadius: px(30),
        borderWidth: px(1),
        borderColor: '#D8D8D8',
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
  height: px(151),
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
      cancelText: {
         fontFamily: 'MiSans-Regular',
    color: '#666',
    fontSize: px(14),
  },
      // 确认按钮
  confirmBtn: {
    width: '100%',
    height: px(43),
    backgroundColor: '#FF9500',
    borderRadius: px(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: px(8),
  },

  confirmText: {
     fontFamily: 'MiSans-Regular',
    color: '#fff',
    fontSize: px(15),
    fontWeight: 400,
  },

  // 取消按钮（可选）
  cancelBtn: {
    width: '100%',
    height: px(43),
    borderRadius: px(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: px(8),
    borderWidth: px(1),
    borderColor: '#ddd',
  },

      // 输入框
  modalInput: {
    //backgroundColor: 'red',
    textAlign: 'right',
    width: px(220),
    height: px(51),
    //borderWidth: px(1),
    borderColor: '#E5E5E5',
    borderRadius: px(8),
    paddingHorizontal: px(10),
    fontSize: px(14),
    lineHeight:px(19),
    fontFamily: 'MiSans-Regular',
    //marginBottom: px(10),
    color: '#1A1A1A',
  },
      // 标题
  modalTitle: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    //fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: px(12),
    textAlign: 'center',
  },
    skuActions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: px(12), // 如果 RN 版本不支持，就用 marginRight
},
    deleteText: {
  fontFamily: 'MiSans-Regular',
  color: '#FF4D4F',
  fontSize: px(13),
  marginLeft: px(12),
},
editText: {
     fontFamily: 'MiSans-Regular',
  color: '#1677FF',
  fontSize: px(13),
},

    skuItem: {
  width: '100%',
  paddingVertical: px(12),
  //paddingHorizontal: px(12),
  //backgroundColor: '#fff',
  //borderBottomWidth: px(1),
  borderBottomColor: '#eee',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

skuTitle: {
  fontFamily: 'MiSans-Regular',
  fontSize: px(14),
  color: '#1A1A1A',
  fontWeight: 400,
},
      // 遮罩层
  modalMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 弹窗主体
  modalBox: {
    width: px(320),
    backgroundColor: '#fff',
    borderRadius: px(12),
    padding: px(16),
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
    smalldes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(9),
        color:'#AAAAAA',
        fontWeight:'400',
        lineHeight:px(12),
    },
    topdes:{
    fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'rgba(118, 118, 118,0.6)',
        fontWeight:'400',
        lineHeight:px(16),
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