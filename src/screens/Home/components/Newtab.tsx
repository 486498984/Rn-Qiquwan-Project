import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import {px} from '../../../utils/scaleUtils';
import request from '../../../api/request';
import ShopItem from "../../../components/Home/ShopItem";


function Newtab({navigation,onLoadMore,onRefresh,type,storedata}) {
  /**
   * 一级tab
   */
  const [firstTab,setFirstTab] =
    useState('all');
  /**
   * 二级tab
   */
  const [secondTab,setSecondTab] =
    useState('all');
  /**
   * 商品列表
   */
  const [list,setList] =
    useState<any[]>([]);
  /**
   * 分页
   */
  const [page,setPage] =
    useState(1);
  const pageSize = 10;
  /**
   * 是否还有更多
   */
  const [hasMore,setHasMore] =
    useState(true);
  /**
   * 加载状态
   */
  const [loading,setLoading] =
    useState(false);
  const firstTabs = [
    {
      key:'all',
      title:'全部',
      gameId:0,
      icon:require('../../../../assets/images/home/quanbuic.png'),
    },
    {
      key:'delta',
      title:'三角洲',
      gameId:1,
      icon:require('../../../../assets/images/home/sanjiao.png'),
    },
    {
      key:'king',
      title:'王者荣耀',
      gameId:2,
      icon:require('../../../../assets/images/home/wangzhe.png'),
    },
  ];
  const secondTabs = [
    {
      key:'all',
      title:'全部',
      categoryId:0,
      icon:require('../../../../assets/images/home/sequanbu.png'),
    },
    {
      key:'escort',
      title:'护航',
      categoryId:11,
      icon:require('../../../../assets/images/home/huhang.png'),
    },
    {
      key:'play',
      title:'陪玩',
      categoryId:12,
      icon:require('../../../../assets/images/home/peiwanic.png'),
    },
    {
      key:'task',
      title:'任务',
      categoryId:13,
      icon:require('../../../../assets/images/home/renwu.png'),
    },
    {
      key:'knife',
      title:'跑刀',
      categoryId:14,
      icon:require('../../../../assets/images/home/paodao.png'),
    },
  ];
useEffect(()=>{
 console.log(storedata);
 
  if(onRefresh){

    onRefresh(()=>{

      loadData(true);

    });

  }

},[]);
  /**
   * 当前游戏id
   */
  const currentGameId =
    firstTabs.find(
      item=>item.key===firstTab
    )?.gameId ?? 0;

  /**
   * 当前分类id
   */
  const currentCategoryId =
    secondTabs.find(
      item=>item.key===secondTab
    )?.categoryId ?? 0;

  useEffect(()=>{
    loadData(true);
  },[
    firstTab,
    secondTab
  ]);
useEffect(()=>{

  if(onLoadMore){

    onLoadMore(()=>{

      loadData(false);

    });

  }

},[
  onLoadMore,
  loading,
  hasMore,
  page
]);
  /**
   * 获取商品列表
   *
   * refresh=true
   * 重新加载
   */
  const loadData = async(
    refresh=false
  )=>{
    if(loading){
      return;
    }
    if(!hasMore && !refresh){
      return;
    }
    const currentPage =
      refresh ? 1 : page;
      const query = {
  gameId: currentGameId,
  categoryId: currentCategoryId,
  page: currentPage,
  pageSize,

  ...(storedata?.id
    ? {
        storeId: storedata.id,
      }
    : {}),
};
    try {
      setLoading(true);
      const response =
      await request({
        url:"/goods/list",
        method:"GET",
        query
      });
      if(
        response.code===0
        &&
        response.data
      ){
        const newList =
          response.data.list || [];
        if(refresh){
          setList(newList);
          setPage(2);
        }else{
          setList(prev=>[
            ...prev,
            ...newList
          ]);
          setPage(prev=>prev+1);
        }
        setHasMore(
          currentPage <
          response.data.totalPage
        );
      }
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false);
    }
  };

  /**
   * 一级tab点击
   */
  const changeFirstTab =
  (item)=>{


    setFirstTab(item.key);


    /**
     * 非三角洲
     * 清空二级
     */
    if(item.key!=='delta'){

      setSecondTab('all');

    }

  };



  return (

<View style={styles.container}>


{/* 一级 */}

<View style={styles.firstRow}>


{
firstTabs.map(item=>{


const active =
firstTab===item.key;


return (

<TouchableOpacity

key={item.key}

onPress={()=>
changeFirstTab(item)
}

style={[
styles.choosebox,
!active &&
styles.nochoosebox
]}


>


<Image

source={item.icon}

style={{
width:px(28),
height:px(28)
}}

/>


<Text

style={[
styles.quanbutitle,
!active &&
styles.noquanbutitle
]}

>

{item.title}

</Text>


</TouchableOpacity>


)


})

}


<View style={styles.nochoosebox}>
<View
style={{
width:px(28),
height:px(28),
backgroundColor:'#D8D8D8',
borderRadius:px(3),
}}
/>
<Text style={styles.noquanbutitle}>
期待中
</Text>
</View>
</View>




{/* 二级 */}

{
firstTab==='delta'
&&

<View style={styles.secondRow}>


{
secondTabs.map(item=>{


const active =
secondTab===item.key;


return (

<TouchableOpacity

key={item.key}

onPress={()=>
setSecondTab(item.key)
}


style={[
styles.sechoosebox,
!active &&
styles.nosechoosebox
]}


>


<Image

source={item.icon}

style={{
width:px(17),
height:px(17)
}}

/>


<Text

style={[
styles.sequanbutitle,
!active &&
styles.nosequanbutitle
]}
>
{item.title}
</Text>
</TouchableOpacity>
)
})
}
</View>
}

{/* 商品列表 */}
<View style={{gap:px(16),paddingTop:px(16)}}>
{
list.map(item=>(
<ShopItem
key={String(item.id)}
item={item}
navigation={navigation}
type={type}
/>
))
}
{
loading &&
<ActivityIndicator
style={{
marginVertical:px(20)
}}
/>
}

</View>


</View>

  )
}


export default React.memo(Newtab);



const styles = StyleSheet.create({

container:{
 paddingHorizontal:px(16),
},
firstRow:{
 marginTop:px(18),
 flexDirection:'row',
 alignItems:'center',
 gap:px(11),
},
secondRow:{
 flexDirection:'row',
 alignItems:'center',
 gap:px(10),
 marginTop:px(12),
},
choosebox:{
 flexDirection:'row',
 backgroundColor:'#FEF7E0',
 height:px(34),
 alignItems:'center',
 borderRadius:px(6),
 paddingHorizontal:px(6),
 gap:px(3)
},
nochoosebox:{
 flexDirection:'row',
 backgroundColor:'#E6EAED',
 height:px(34),
 alignItems:'center',
 borderRadius:px(6),
 paddingHorizontal:px(6),
 gap:px(3)
},
sechoosebox:{
 flexDirection:'row',
 backgroundColor:'#FEF7E0',
 height:px(27),
 alignItems:'center',
 borderRadius:px(6),
 paddingLeft:px(7),
 paddingRight:px(12),
 gap:px(3)
},
nosechoosebox:{
 flexDirection:'row',
 backgroundColor:'#E6EAED',
 height:px(27),
 alignItems:'center',
 borderRadius:px(6),
 paddingLeft:px(7),
 paddingRight:px(12),
 gap:px(3)
},
quanbutitle:{
 fontFamily:'MiSans-Regular',
 fontSize:px(13),
 color:'#FF9500',
 fontWeight:'400',
 lineHeight:px(17),
},
noquanbutitle:{
 fontFamily:'MiSans-Regular',
 fontSize:px(13),
 color:'#1A1A1A',
 fontWeight:'400',
 lineHeight:px(17),
},
sequanbutitle:{
 fontFamily:'MiSans-Regular',
 fontSize:px(12),
 color:'#FF9500',
 fontWeight:'400',
 lineHeight:px(16),
},
nosequanbutitle:{
 fontFamily:'MiSans-Regular',
 fontSize:px(12),
 color:'#1A1A1A',
 fontWeight:'400',
 lineHeight:px(16),
},
});