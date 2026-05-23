import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView } from 'react-native'
import React,{useEffect,useState} from 'react'
import { px } from '../../utils/scaleUtils';
import request from '../../api/request';
import ClubItem from '../../components/Club/FollowClubItem'
import Storage from '../../utils/storage';


export default function Follow({navigation}) {
  const [followlist, setFollowlist] = useState([]); //关注列表
  const handleback = () => {  //返回上一页
   navigation.goBack();
  }; 
  useEffect(() => {
    getfollwlist()
  }, [])
  const getfollwlist = async() => { 
        const user = await Storage.get("userinfo");
          try {
           const response = await request({
             url: '/user/follows/stores',
             method: 'GET',
             data:{
            },
             query: {
              userId:user.user.userId,
               page:1,
                size:10,
             }
           });
           console.log(response);
          if(response.data!==undefined&&response.code==0){
          if(response.data.list!==null){
          setFollowlist(response.data.list)
          }
          }
         } catch (error) {
           console.error(error);
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
            <Text style={styles.title}>关注</Text>
               </View>
             </View>
   <ScrollView contentContainerStyle={{paddingHorizontal:px(16),gap:px(16),
         paddingTop:px(20),paddingBottom:px(35)
     }} showsVerticalScrollIndicator={false}
     >
          {followlist.map((item,index)=>
           <ClubItem navigation={navigation} key={index} item={item} 
           type={2}
           />
          )}
   {followlist.length!==0&&
    <View style={{alignItems:'center',marginTop:px(10)}}>
    <Text style={styles.bottomtext}>我是有底线的～</Text>
    </View>
   }
   {followlist.length==0&&
    <View style={{alignItems:'center',marginTop:px(10)}}>
    <Text style={styles.bottomtext}>暂无内容</Text>
    </View>
   }
 </ScrollView>
     </View>
  )
}

const styles = StyleSheet.create({
          bottomtext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(17),
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