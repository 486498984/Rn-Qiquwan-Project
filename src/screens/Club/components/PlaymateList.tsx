import {
  View,
  Text,
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


import {px} from '../../../utils/scaleUtils';

import request from '../../../api/request';

import PlayerItem from '../../../components/Home/PlayerItem';



const firstTabs=[
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



interface Props{

  navigation:any;

  /**
   * 店铺id
   */
  storeId?:number|string;

}



export default function PlaymateList({
  navigation,
  storeId,
}:Props){



const [firstTab,setFirstTab]=
useState('all');



const [list,setList]=
useState<any[]>([]);



const [page,setPage]=
useState(1);



const [hasMore,setHasMore]=
useState(true);



const [loading,setLoading]=
useState(false);



const [refreshing,setRefreshing]=
useState(false);




const getGameId=()=>{


 const tab =
 firstTabs.find(
 item=>item.key===firstTab
 );


 return tab?.gameId ?? 0;


};





const getplayerlist=async(
 currentPage=1,
 refresh=false
)=>{


 if(loading)return;



 try{


 setLoading(true);



 const response =
 await request({

 url:'/player/list',

 method:'GET',

 query:{


 page:currentPage,


 pageSize:10,


 gameId:getGameId(),


 /**
  * 店铺筛选
  */
 storeId:storeId || undefined,


 },


 });



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



 setHasMore(
 data.length>=10
 );



 setPage(currentPage);


 }



 }catch(error){


 console.log(error);


 }finally{


 setLoading(false);


 }



};







useEffect(()=>{


 getplayerlist(
 1,
 true
 );


},[]);







useEffect(()=>{


 getplayerlist(
 1,
 true
 );


},[
 firstTab,
 storeId
]);







const changeFirstTab=(item:any)=>{


 if(item.key===firstTab){
 return;
 }


 setFirstTab(item.key);


};







const handleRefresh=
useCallback(()=>{


 setRefreshing(true);



 getplayerlist(
 1,
 true
 )
 .finally(()=>{


 setRefreshing(false);


 });


},[
 firstTab,
 storeId
]);







const handleLoadMore=()=>{


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
!active&&styles.nochoosebox
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
!active&&styles.noquanbutitle
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


)

};







const renderFooter=()=>{


if(!loading){
return null;
}



return (

<View
style={{
height:px(50),
alignItems:'center',
justifyContent:'center'
}}
>

<ActivityIndicator/>

</View>

)

};






return (

<View
style={{
flex:1
}}
>


<View
style={{
backgroundColor:'#F2F3F5',
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



style={{
paddingHorizontal:px(16)
}}



contentContainerStyle={{
gap:px(18),
marginTop:px(10)
}}



renderItem={({item})=>(

<PlayerItem

navigation={navigation}

type={2}

item={item}

/>

)}



showsVerticalScrollIndicator={false}



onEndReached={handleLoadMore}



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



ListEmptyComponent={

!loading?

<View

style={{
height:px(300),
justifyContent:'center',
alignItems:'center'
}}

>

<Text>
暂无陪玩
</Text>


</View>

:null


}



/>


</View>

)

}





const styles={


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


};