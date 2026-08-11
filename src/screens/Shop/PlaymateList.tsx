import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
  TextInput,
} from 'react-native';


import React,{
 useState,
 useEffect,
 useCallback,
 useRef
} from 'react';


import {
 TabView
} from 'react-native-tab-view';


import {
 px
} from '../../utils/scaleUtils';


import request from '../../api/request';


import PlayerItem from './components/PlayerItem';
import {
  useFocusEffect
} from '@react-navigation/native';


const STATUS_MAP:any={

 all:'',

 free:'ONLINE',

 busy:'BUSY',

 offline:'OFFLINE',

};





const TabContent=({

 data,

 loading,

 hasMore,

 onLoadMore,

 navigation,

 currentTab,

 onRefresh,
 refreshing,
}:any)=>{


return (

<FlatList


data={data}


keyExtractor={(item,index)=>
`${item.id}_${index}`
}


renderItem={({item})=>(

<PlayerItem
item={item}
navigation={navigation}
/>
)}
contentContainerStyle={{
paddingHorizontal:px(16),
paddingTop:px(10),
paddingBottom:px(50),
gap:px(8)
}}
showsVerticalScrollIndicator={false}
onEndReached={()=>{
 if(hasMore&&!loading){
   onLoadMore();
 }
}}
onEndReachedThreshold={0.3}
refreshControl={
<RefreshControl
refreshing={!!refreshing}
onRefresh={onRefresh}
/>
}
ListFooterComponent={()=>{
if(data.length===0)
return null;


return (

<View
style={{
paddingVertical:px(20),
alignItems:'center'
}}
>

<Text
style={{
color:'#999',
fontSize:px(12)
}}
>

{
loading
?
'加载中...'
:
hasMore
?
''
:
'没有更多了'
}

</Text>


</View>

)

}}




ListEmptyComponent={()=>{


if(loading)
return null;


return (

<View
style={{
paddingTop:px(80),
alignItems:'center'
}}
>

<Text
style={{
color:'#999',
fontSize:px(13)
}}
>

暂无陪玩

</Text>


</View>

)

}}


/>


)

};







export default function PlayerManage({

navigation,

route

}:any){



const {
storeinfo
}=route.params||{};



const layout=
useWindowDimensions();



const [refreshing,setRefreshing] = useState(false);
const [index,setIndex]=useState(0);

const [username, setUsername] = useState("");

const [routes]=useState([


{
key:'all',
title:'全部'
},


{
key:'free',
title:'空闲'
},


{
key:'busy',
title:'在忙'
},


{
key:'offline',
title:'离线'
},


]);






const [tabData,setTabData]=useState<any>({


all:{
list:[],
page:1,
hasMore:true,
loading:false
},


free:{
list:[],
page:1,
hasMore:true,
loading:false
},


busy:{
list:[],
page:1,
hasMore:true,
loading:false
},


offline:{
list:[],
page:1,
hasMore:true,
loading:false
},


});



     const onChangeText = (e) => {
      console.log(e);
      setUsername(e)
        // 搜索时重新加载第一页
     //getemployeelist(1, true, e);
     };

const fetchPlayerList=async(

tabKey:string,

refresh=false

)=>{


const current=
tabData[tabKey];


if(current.loading)
return;


if(!refresh&&!current.hasMore)
return;



const page=
refresh
?
1
:
current.page;




setTabData((prev:any)=>({

...prev,

[tabKey]:{

...prev[tabKey],

loading:true

}

}));





try{

console.log('陪玩请求参数:',{
  storeId:storeinfo,
  workStatus:STATUS_MAP[tabKey],
  keyword:username || '',
});
const response=
await request({


url:'/store/player/list',


method:'GET',
query:{
storeId:storeinfo,
workStatus:
STATUS_MAP[tabKey],
keyword: username,
}
});
console.log(response);
if(response.code===0){
const newList=
response?.data?.list||[];




setTabData((prev:any)=>{


const list=
refresh
?
newList
:
[
...prev[tabKey].list,
...newList
];



const unique=
Array.from(
new Map(
list.map(
item=>[
item.id,
item
]
)
).values()
);



return {


...prev,


[tabKey]:{


list:unique,


page:page+1,


hasMore:newList.length===10,


loading:false


}



}


});



}else{


setTabData((prev:any)=>({

...prev,

[tabKey]:{

...prev[tabKey],

loading:false

}


}));


}



}catch(e){


console.log(
'获取陪玩失败',
e
);



setTabData((prev:any)=>({

...prev,

[tabKey]:{

...prev[tabKey],

loading:false

}

}));



}



};






useEffect(()=>{


const key=
routes[index].key;


fetchPlayerList(
key,
true
);


},[index]);

 

useEffect(()=>{

  const timer = setTimeout(()=>{

    const key =
    routes[index].key;


    fetchPlayerList(
      key,
      true
    );


  },500);



  return ()=>{

    clearTimeout(timer);

  };


},[username]);


useFocusEffect(
  useCallback(()=>{

    const key =
      routes[index].key;


    fetchPlayerList(
      key,
      true
    );

 
  },[index, username])
);

const renderScene=({route}:any)=>{


const item=
tabData[route.key];


return (

<TabContent

data={item.list}

loading={item.loading}

hasMore={item.hasMore}

currentTab={route.key}


navigation={navigation}



onLoadMore={()=>{

fetchPlayerList(
route.key
)

}}



onRefresh={async()=>{

  setRefreshing(true);

  await fetchPlayerList(
    route.key,
    true
  );

  setRefreshing(false);

}}


/>


)


};






const renderTabBar=useCallback(

({navigationState,jumpTo}:any)=>{


return (

<View
style={{
height:px(50),
backgroundColor:'#fff'
}}
>


<ScrollView

horizontal

showsHorizontalScrollIndicator={false}

contentContainerStyle={{
alignItems:'center'
}}

>


{
navigationState.routes.map(
(route:any,i:number)=>{


const active=
navigationState.index===i;


return (

<TouchableOpacity

key={route.key}

style={{
width:px(90),
height:px(50),
alignItems:'center',
justifyContent:'center'
}}

onPress={()=>jumpTo(route.key)}

>


<Text
style={{
fontSize:px(14),
color:
active
?
'#FF9500'
:
'#1A1A1A'
}}
>

{route.title}
({tabData[route.key]?.list?.length ?? 0})
</Text>



{
active&&

<View

style={{

position:'absolute',

bottom:px(5),

width:px(22),

height:px(3),

backgroundColor:'#FF9500',

borderRadius:px(10)

}}

/>

}



</TouchableOpacity>

)


}

)

}



</ScrollView>


</View>


)

},

 [tabData]


);







return (

<TouchableWithoutFeedback

onPress={Keyboard.dismiss}

accessible={false}

>


<View
style={styles.container}
>


<View
style={{
height:px(98),
backgroundColor:'#fff',
justifyContent:'flex-end'
}}
>


<View
style={{
height:px(50),
alignItems:'center',
justifyContent:'center'
}}
>


<TouchableOpacity

style={{
position:'absolute',
left:px(16)
}}

onPress={()=>navigation.goBack()}

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
陪玩管理
</Text>


</View>


</View>

<View style={{paddingHorizontal:px(16),backgroundColor: '#fff',}}>
    <View style={{width: '100%',height: px(32),backgroundColor: '#F2F3F5',
             borderRadius: px(20), flexDirection: 'row',alignItems: 'center',
             padding:px(0),
            }}>
            <Image source={require('../../../assets/images/my/search1.png')} 
            style={{width:px(16),height:px(16),marginLeft: px(8),}}></Image>
            <TextInput
            allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={onChangeText}
            value={username || ''}
            placeholder="搜索"
            placeholderTextColor="#AAAAAA"
            maxLength={20}
            selectionColor='#FC9026'
            />
            </View>
</View>



<TabView

navigationState={{
index,
routes
}}

renderScene={renderScene}

onIndexChange={setIndex}

initialLayout={{
width:layout.width
}}

renderTabBar={renderTabBar}


/>


</View>


</TouchableWithoutFeedback>


)

}







const styles=StyleSheet.create({
          inputbox:{
       //backgroundColor: 'red',
  paddingTop:0,
  paddingBottom:0,
    marginLeft: px(7),
  
  width: px(285),
  //height: px(32),
  fontSize: px(12),
  fontFamily: 'MiSans-Regular',
    },

container:{
flex:1,
backgroundColor:'#F7F8FC'
},


title:{
fontFamily:'MiSans-Medium',
fontSize:px(16),
color:'#1A1A1A'
}


});