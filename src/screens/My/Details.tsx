import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,

 } from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';

const tixianlist=[{type:1},{type:2},{type:2},{type:2},{type:2}]
const WithdrawItem=({item})=>{
return(
    <View style={{width: '100%',backgroundColor: '#fff',height: px(79),
        flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
        paddingHorizontal:px(16)
    }}>
<View style={{flexDirection: 'column',alignItems: 'flex-start',gap:px(12)}}>
    {item.type==1&&
    <Text style={styles.tixiantitle}>提现</Text>
    }
  {item.type==2&&
    <Text style={styles.tixiantitle}>分佣</Text>
    }
<Text style={styles.time}>编号：219739012479102</Text>
</View>
<View style={{flexDirection: 'column',alignItems: 'flex-end',gap:px(12)}}>


        {item.type==1&&
     <Text style={styles.price1}>-83.00</Text>
     }
    {item.type==2&&
     <Text style={styles.price2}>+2.20</Text>
     }
    {item.type==1&&
<Text style={styles.time}>2026-10-12 10:39</Text>

    }
    {item.type==2&&
<Text style={styles.time}>2026-10-12 10:39</Text>

    }
 

</View>
    </View>
)
};
export default function Details({navigation}) {


 const handleback = () => {  //返回上一页
   navigation.goBack();
     };
  return (
    <View>
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
            <Text style={styles.title}>资产明细</Text>
               </View>
             </View>

   <ScrollView contentContainerStyle={{paddingHorizontal:px(0),
                    paddingBottom:px(0),
                }}
                showsVerticalScrollIndicator={false} 
                style={{paddingTop:px(16),backgroundColor: '#F2F3F5',
                }}>
                <View style={{gap:px(0)}}>
                {tixianlist.map((item,index)=>
                    <View key={index} style={{alignItems: 'center',backgroundColor: '#fff',}}>
                    <WithdrawItem item={item}/>
                    {index!==tixianlist.length-1&&
                           <View style={{width: px(361),height: px(1),
                        backgroundColor: 'rgba(118, 118, 118, 0.2)',}}/>
                    }
                    </View>
                    )}
                </View>
                  
    {tixianlist.length==0?(
     <View style={{alignItems:'center',marginTop:px(16)}}>
         <Text style={styles.bottomtext}>暂无内容</Text>
         </View>
        ):(
         <View style={{alignItems:'center',marginTop:px(16)}}>
            <Text style={styles.bottomtext}>我是有底线的～</Text>
            </View>
        )}
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
            price3:{
  fontFamily: 'MiSans-Medium',
    fontSize:px(20),
    color:'#1A1A1A',
    //fontWeight:500,
    lineHeight:px(27),
    },
        price2:{
  fontFamily: 'MiSans-Medium',
    fontSize:px(20),
    color:'#DE5452',
    //fontWeight:500,
    lineHeight:px(27),
    },
    price1:{
  fontFamily: 'MiSans-Medium',
    fontSize:px(20),
    color:'#FF9500',
    //fontWeight:500,
    lineHeight:px(27),
    },
    yidakuan:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#3CF15F',
        fontWeight:400,
        lineHeight:px(13),
    },
    shenheshi:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#DE5452',
        fontWeight:400,
        lineHeight:px(13),
    },
    shenhez:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(13),
    },
    time:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    tixiantitle:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(17),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(23),
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