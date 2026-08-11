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


import {px} from '../../utils/scaleUtils';
import request from '../../api/request';
import ShopItem from "../../components/Home/ShopItem";



export default function GoodsList({navigation,route}) {

const {type}=route.params||{}
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



  const [list,setList] =
  useState<any[]>([]);



  const [page,setPage] =
  useState(1);


  const pageSize = 10;


  const [hasMore,setHasMore] =
  useState(true);



  const [loading,setLoading] =
  useState(false);



  const firstTabs=[
    {
      key:'all',
      title:'全部',
      gameId:0,
      icon:require('../../../assets/images/home/quanbuic.png'),
    },
    {
      key:'delta',
      title:'三角洲',
      gameId:1,
      icon:require('../../../assets/images/home/sanjiao.png'),
    },
    {
      key:'king',
      title:'王者荣耀',
      gameId:2,
      icon:require('../../../assets/images/home/wangzhe.png'),
    },
  ];



  const secondTabs=[
    {
      key:'all',
      title:'全部',
      categoryId:0,
      icon:require('../../../assets/images/home/sequanbu.png'),
    },
    {
      key:'escort',
      title:'护航',
      categoryId:11,
      icon:require('../../../assets/images/home/huhang.png'),
    },
    {
      key:'play',
      title:'陪玩',
      categoryId:12,
      icon:require('../../../assets/images/home/peiwanic.png'),
    },
    {
      key:'task',
      title:'任务',
      categoryId:13,
      icon:require('../../../assets/images/home/renwu.png'),
    },
    {
      key:'knife',
      title:'跑刀',
      categoryId:14,
      icon:require('../../../assets/images/home/paodao.png'),
    },
  ];




  const currentGameId =
  firstTabs.find(
    item=>item.key===firstTab
  )?.gameId ?? 0;



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






  /**
   * 请求商品
   */
  const loadData = async(
    refresh=false
  )=>{


    if(loading){
      return;
    }


    if(!hasMore&&!refresh){
      return;
    }



    const currentPage =
    refresh ? 1 : page;



    try{


      setLoading(true);



      const res =
      await request({

        url:'/goods/list',

        method:'GET',

        query:{

          gameId:currentGameId,

          categoryId:currentCategoryId,

          page:currentPage,

          pageSize,
          platform:type

        }

      });



      if(
        res.code===0 &&
        res.data
      ){


        const newList =
        res.data.list || [];



        if(refresh){


          setList(newList);

          setPage(2);


        }else{


          setList(prev=>[
            ...prev,
            ...newList
          ]);


          setPage(
            prev=>prev+1
          );

        }



        setHasMore(
          currentPage <
          res.data.totalPage
        );


      }



    }catch(e){

      console.log(e);

    }finally{

      setLoading(false);

    }

  };





  const changeFirstTab=(item)=>{
    setFirstTab(item.key);
    if(item.key!=='delta'){
      setSecondTab('all');
    }
  };







  const renderHeader=()=>{
    return (
      <>
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
            <View style={{
                 flexDirection:'row',
             backgroundColor:'#E6EAED',
             height:px(34),
             alignItems:'center',
             borderRadius:px(6),
             paddingHorizontal:px(6),
             gap:px(3)
            }}>
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
      </>
    )
  };

  const handleback = () => {  //返回上一页
    navigation.goBack(); 
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
           <Text style={styles.title}>{type}专区</Text>
               </View>
             </View>
{/* 固定tab区域 */}
<View
style={{
backgroundColor:'#fff',
paddingHorizontal:px(16),
paddingBottom:px(10),
zIndex:10,
}}
>
{renderHeader()}
</View>

{/* 商品列表 */}
<FlatList
data={list}
style={{
paddingHorizontal:px(16),
}}
contentContainerStyle={{
gap:px(16),
paddingTop:px(10),
paddingBottom:px(66)
}}
keyExtractor={
(item,index)=>
`${item.id}_${index}`
}
renderItem={({item})=>(
<ShopItem
item={item}
navigation={navigation}
/>
)}
onEndReached={()=>{
loadData(false);
}}
onEndReachedThreshold={0.2}
ListFooterComponent={
loading ?
<ActivityIndicator
style={{
marginVertical:px(20)
}}
/>
:
null
}
showsVerticalScrollIndicator={false}
/>

</View>


)

}





const styles=StyleSheet.create({

      title:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
  },
    container:{
        flex: 1,
        backgroundColor: '#fff',
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
},


noquanbutitle:{
 fontFamily:'MiSans-Regular',
 fontSize:px(13),
 color:'#1A1A1A',
},


sequanbutitle:{
 fontFamily:'MiSans-Regular',
 fontSize:px(12),
 color:'#FF9500',
},


nosequanbutitle:{
 fontFamily:'MiSans-Regular',
 fontSize:px(12),
 color:'#1A1A1A',
},


});