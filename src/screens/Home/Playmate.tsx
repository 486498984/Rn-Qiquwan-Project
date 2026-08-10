import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import {px} from '../../utils/scaleUtils';
import request from '../../api/request';
import PlayerItem from "../../components/Home/PlayerItem";


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


export default function Playmate({navigation}) {


  /**
   * 当前一级tab
   */
  const [firstTab,setFirstTab] =
    useState('all');


  /**
   * 列表数据
   */
  const [list,setList] =
    useState<any[]>([]);


  /**
   * 当前页
   */
  const [page,setPage] =
    useState(1);


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


  /**
   * 下拉刷新
   */
  const [refreshing,setRefreshing] =
    useState(false);



  /**
   * 根据tab获取gameId
   */
  const getGameId = () => {

    const tab =
      firstTabs.find(
        item=>item.key===firstTab
      );

    return tab?.gameId ?? 0;
  };



  /**
   * 获取列表
   */
  const getplayerlist = async(
    currentPage=1,
    refresh=false
  )=>{


    if(loading)return;


    try {

      setLoading(true);


      const response =
      await request({

        url:'/player/list',

        method:'GET',

        query:{

          page:currentPage,

          pageSize:10,

          /**
           * 当前游戏分类
           */
          gameId:getGameId(),

        },

      });



      console.log(
        '列表:',
        response
      );


      if(
        response.code===0 &&
        response.data
      ){


        const data =
          response.data.records || 
          response.data.list ||
          [];


        if(refresh){

          setList(data);

        }else{

          setList(prev=>[
            ...prev,
            ...data
          ]);

        }


        /**
         * 判断是否还有数据
         */
        if(data.length < 10){

          setHasMore(false);

        }else{

          setHasMore(true);

        }

        setPage(currentPage);

      }


    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };





  /**
   * 第一次进入加载
   */
  useEffect(()=>{

    getplayerlist(1,true);

  },[]);





  /**
   * 切换tab
   */
  const changeFirstTab=(item:any)=>{


    if(item.key===firstTab)return;


    setFirstTab(item.key);


  };





  /**
   * 监听tab变化重新请求
   */
  useEffect(()=>{


    getplayerlist(
      1,
      true
    );


  },[firstTab]);





  /**
   * 下拉刷新
   */
  const handleRefresh =
  useCallback(()=>{


    setRefreshing(true);


    getplayerlist(
      1,
      true
    ).finally(()=>{

      setRefreshing(false);

    });


  },[firstTab]);





  /**
   * 加载更多
   */
  const handleLoadMore = ()=>{


    if(
      !hasMore ||
      loading
    ){
      return;
    }
 

    getplayerlist(
      page+1,
      false
    );

  };






  const renderHeader=()=>{


    return (

      <View
      style={styles.firstRow}
      >

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


      </View>

    )

  };




  /**
   * footer
   */
  const renderFooter=()=>{


    if(!loading)return null;


    return (

      <View
      style={{
        height:px(50),
        justifyContent:'center',
        alignItems:'center'
      }}
      >

      <ActivityIndicator />

      </View>

    )

  };






  const handleback = () => {

    navigation.goBack();

  };




  return (


<View style={styles.container}>


<View 
style={{
width:px(393),
height:px(98),
backgroundColor:'#fff',
flexDirection:'row',
alignItems:'flex-end',
}}

>


<View

style={{
width:'100%',
paddingHorizontal:px(16),
marginBottom:px(18),
flexDirection:'row',
alignItems:'center',
justifyContent:'center',
}}

>


<TouchableOpacity

onPress={handleback}

style={{
position:'absolute',
left:px(16),
}}

>


<Image

source={
require('../../../assets/images/my/left.png')
}

style={{
width:px(22),
height:px(22)
}}

/>


</TouchableOpacity>



<Text style={styles.title}>
陪玩主播
</Text>


</View>


</View>





{/* tab */}

<View

style={{
backgroundColor:'#fff',
paddingHorizontal:px(16),
paddingBottom:px(10),
}}

>

{renderHeader()}


</View>






<FlatList


data={list}


keyExtractor={(item,index)=>
 `${item.id}_${index}`
}

style={{paddingHorizontal:px(16),}}
contentContainerStyle={{gap:px(18),marginTop: px(10),}}
/**
 * 列表item
 */
renderItem={({item})=>(
<PlayerItem
navigation={navigation}
type={2}
item={item}
/>
)}

showsVerticalScrollIndicator={false}

onEndReached={
 handleLoadMore
}


onEndReachedThreshold={0.3}



ListFooterComponent={
 renderFooter
}



refreshControl={

<RefreshControl

refreshing={refreshing}

onRefresh={handleRefresh}

/>

}



/**
 * 空数据
 */
ListEmptyComponent={

!loading?

<View
style={{
height:px(300),
alignItems:'center',
justifyContent:'center'
}}
>

<Text>
暂无数据
</Text>

</View>

:null

}



 />




</View>

  )

}







const styles = StyleSheet.create({

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



firstRow:{

 marginTop:px(18),

 flexDirection:'row',

 alignItems:'center',

 gap:px(11),

},



title:{

 fontFamily:'MiSans-Medium',

 fontSize:px(16),

 color:'#1A1A1A',

 lineHeight:px(21),

},



container:{

 flex:1,

 backgroundColor:'#F2F3F5',

},


});