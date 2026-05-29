import { StyleSheet, Text, View,TouchableOpacity, } from 'react-native'
import React,{useState} from 'react'
import { px } from '../../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import request from '../../../api/request'
import {
  Toast,Modal as Modalitem,
} from '@ant-design/react-native'


const EmployeeItem=({navigation,item,onRefresh})=> {
  const [type, setType] = useState(1);
  const handlebanuser = async() => { 
           Modalitem.alert('提示', '是否禁用员工？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handleban(),
       style: { color: '#FC9026' },
       },
      ])
   };
   const handleban = async() => { 
     try {
const response = await request({
  url: '/store/role/status',
  method: 'PUT',
  data: {
    storeId:item.storeId,
    id:item.id,
    status:0,
    },
   query: {
   },
    }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0) {
      //console.log(response.data.list);
    Toast.success({
    content: '禁用成功',
    duration: 2,
    position: 'center',
    mask: false,
  })
      onRefresh();
      }else{
    Toast.fail({
    content: '禁用失败，请稍后再试',
    duration: 2,
    position: 'center',
    mask: false,
  })
      onRefresh();
      }
      } catch (error) {
      console.error(error);
      }

    };
    const handleopenuser = () => { 
           Modalitem.alert('提示', '是否启用员工？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handleopen(),
       style: { color: '#FC9026' },
       },
      ])

     };
     const handleopen = async() => { 
     try {
const response = await request({
  url: '/store/role/status',
  method: 'PUT',
  data: {
    storeId:item.storeId,
    id:item.id,
    status:1,
    },
   query: {
   },
    }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0) {
      //console.log(response.data.list);
    Toast.success({
    content: '启用成功',
    duration: 2,
    position: 'center',
    mask: false,
    })
      onRefresh();
      }else{
    Toast.fail({
    content: '启用失败，请稍后再试',
    duration: 2,
    position: 'center',
    mask: false,
  })
      onRefresh();
      }
      } catch (error) {
      console.error(error);
      }
      };
      const handledelete = () => { 
           Modalitem.alert('提示', '是否删除员工？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handledeletee(),
       style: { color: '#FC9026' },
       },
      ])
       };
      const handledeletee = async() => { 
     try {
const response = await request({
  url: '/store/role/delete',
  method: 'DELETE',
  data: {
    storeId:item.storeId,
    id:item.id,
    },
   query: {
   },
    }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0) {
      //console.log(response.data.list);
      Toast.success({
      content: '删除成功',
      duration: 2,
      position: 'center',
      mask: false,
      })
      onRefresh();
      }else{
            Toast.fail({
    content: '删除失败，请稍后再试',
    duration: 2,
    position: 'center',
    mask: false,
  })
      onRefresh();
      }
      } catch (error) {
      console.error(error);
      }

      };
  return (
    <View style={styles.employbox}>
        <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
      <Text style={styles.nickname}>{item?.name}</Text>
            <Text style={styles.idnumber}>ID：{item?.id}</Text>
        </View>
   <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(7),
   }}>
      <Text style={styles.idnumber}>账号：{item?.phone}</Text>
            <Text style={styles.idnumber}>{item?.roleName}</Text>
        </View>
<View style={{width: px(345),height: px(1),backgroundColor: 'rgba(118, 118, 118, 0.1)',
    marginTop: px(11),
}}></View>



      <View style={{marginTop: px(8),flexDirection: 'row',alignItems: 'center',
              justifyContent: 'space-between',}}>
                <Text style={styles.creattime}>创建时间：{item?.createdAt}</Text>
                <View style={{flexDirection: 'row',alignItems: 'center',gap:px(12)}}>
   <TouchableOpacity style={styles.cannelbox} 
   onPress={()=>handledelete()}
          >
    <Text style={styles.canneltext}>删除</Text>
      </TouchableOpacity>
           <TouchableOpacity style={styles.cannelbox} 
           onPress={()=>navigation.navigate('ShopEditEmployee',{type:2,item:item})}>
    <Text style={styles.canneltext}>编辑</Text>
      </TouchableOpacity>
      {item.status=="ACTIVE"&&
        <TouchableOpacity style={styles.cannelbox} 
        onPress={()=>handlebanuser()}>
    <Text style={styles.canneltext}>禁用</Text>
      </TouchableOpacity>
      }
       {item.status!=="ACTIVE"&&
          <TouchableOpacity onPress={()=>handleopenuser()}>
     <LinearGradient
          colors={['#FEC525', '#FC9026']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.gradientBox]}
        >
          <Text style={styles.logintext}>
            启用
          </Text>
        </LinearGradient>
  </TouchableOpacity>
    }

  </View>
  </View>


    </View>
  )
}
export default React.memo(EmployeeItem);
const styles = StyleSheet.create({
        creattime:{
        width: px(59),
        height: px(26),
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
            canneltext:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        lineHeight:px(16),
        color:'#1A1A1A',
        fontWeight:400,
    },
    cannelbox:{
width: px(80),
height: px(26),
borderRadius: px(15),
borderWidth: px(1),
borderColor: '#D8D8D8',
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
    },
  logintext:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(12),
    color: '#FFFFFF',
    lineHeight: px(16),
  },
    gradientBox: {
    width:px(80),
    height: px(26),
    borderRadius: px(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
    idnumber:{
fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    nickname:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(19),
    },
employbox:{
    backgroundColor: '#fff',
    padding:px(8),
    width: '100%',
    borderRadius: px(8),
}
})