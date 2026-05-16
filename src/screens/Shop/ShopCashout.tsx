import { StyleSheet, Text, View,TouchableOpacity,Image,Platform,TextInput,

 } from 'react-native'
import React,{useState} from 'react'
import { px } from '../../utils/scaleUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import CustomModal from '../../components/My/CustomModal';
import BottomModal from '../../components/My/BottomModal';
import {
  Radio,
} from '@ant-design/react-native'



export default function ShopCashout({ navigation }) {
    const [visible, setVisible] = useState(false);
    const [visiblemode, setVisiblemode] = useState(false) //zfb、银行卡
    const insets = useSafeAreaInsets();
    const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
    const handleback = () => {  //返回上一页
    navigation.goBack();
    };
      const [username, setUsername] = useState(null);
      const [usernameyhk, setUsernameyhk] = useState(null); //银行卡账户名
       const [userbranch, setUserbranch] = useState(null);//银行支行
      const [usernumber, setUsernumber] = useState(null);//支付宝账号
      const [usernumberyhk, setUsernumberyhk] = useState(null);//银行卡账号
      const [tixianmode, setTixianmode] = useState(1); //提现模式
      const [tixianzanmode, setTixianzanmode] = useState(1); //暂时提现模式
      const [yhkvisible, setYhkvisible] = useState(false); //银行卡弹窗开关
            const onChangeText = (e) => { 
                console.log(e);
                setUsername(e)
              };
            const onChangeyhkText = (e) => {  //修改银行卡账户名
                console.log(e);
                setUsernameyhk(e)
              };
               const onnumChangeText = (e) => { //支付宝账号
                console.log(e);
                setUsernumber(e)
              };
                  const onnumChangeyhkText = (e) => { //银行卡账号
                console.log(e);
                setUsernumberyhk(e)
              };
              const userbranchChangeText = (e) => { 
                console.log(e);
                setUserbranch(e)
              };
  const onGroupChange = (e) => { 
  console.log(e);
  setTixianzanmode(e.target.value)
  };
  const handlechoosemode = (e) => { //切换模式
  setTixianzanmode(e)
  };
   const handlechoose = () => {  //确定按钮
    setTixianmode(tixianzanmode)
    setVisiblemode(false)
   };
   const handleopenmodal = () => { 
    if( tixianmode==1){
    setVisible(true);
    }else{
    setYhkvisible(true)
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
      <Text style={styles.title}>提现</Text>
            <TouchableOpacity   style={{  position: 'absolute',
            right: px(16),flexDirection: 'row',alignItems: 'center',height:px(35),
            }} onPress={()=>navigation.navigate('ShopCashItem')}>
              <Text style={styles.alltx}>提现记录</Text>
            </TouchableOpacity>
          </View>
        </View>
<View style={{flexDirection: 'column',marginTop: px(16),backgroundColor: '#FFFFFF',
   padding:px(16),gap:px(16)
}}>
<Text style={styles.titletop}>提现至</Text>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
  justifyContent: 'space-between',
}} onPress={() => setVisiblemode(true)}>
  <View style={{flexDirection: 'row',alignItems: 'center',gap:px(12),}}>
    {tixianmode==1&&
     <Image source={require('../../../assets/images/home/zfb.png')} 
              style={{width:px(32),height:px(32)}}></Image>
    }
  {tixianmode==2&&
     <Image source={require('../../../assets/images/my/yhk.png')} 
              style={{width:px(32),height:px(32)}}></Image>
    }
              <Text style={styles.titletop}>{tixianmode==1?'支付宝':'银行卡'}</Text>
  </View>

  <Image source={require('../../../assets/images/my/cright.png')} 
  style={{width:px(19),height:px(19)}}></Image>   
</TouchableOpacity>
<View style={{width: px(361),backgroundColor: 'rgba(118, 118, 118,0.2)',height: px(1),}}></View>
<Text style={styles.zfbtitle}>{tixianmode==1?'支付宝账号':'银行卡号'}</Text>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}  onPress={() => {
    handleopenmodal()
  }}>
  {tixianmode==1?(
<Text style={usernumber?styles.zfbisdes:styles.zfbdes}>{usernumber?usernumber:'需填写实名认证的本人支付宝账号'}</Text>
  ):(
<Text style={usernumberyhk?styles.zfbisdes:styles.zfbdes}>{usernumberyhk?usernumberyhk:'请填写银行卡信息'}</Text>
  )
  }
 <Image source={require('../../../assets/images/my/cright.png')} 
  style={{width:px(19),height:px(19)}}></Image>   
</TouchableOpacity>
</View>

<View style={{width: '100%',backgroundColor: '#fff',padding:px(16),
    marginTop: px(16),gap:px(16)}}>
<Text style={styles.titletop}>提现金额</Text>
<View style={{flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(6)}}>
 <Text style={styles.titletop}>￥</Text>
  <Text style={styles.titletop}>199.00</Text>
</View>
  <Text style={styles.zfbdes}>可提现:199.00</Text>
</View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',padding:px(16),
    marginTop: px(16),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
 <Text style={styles.titletop}>手续费</Text>
<Text style={styles.zfbdes}>￥0</Text>
    </View>

<View style={{width: '100%',backgroundColor: '#fff',padding:px(16),
    marginTop: px(16),gap:px(16)}}>
 <Text style={styles.titletop}>提现须知</Text>
<View>
      <Text style={styles.zfbdes}>
        1、每日默认提现1次;{'\n'}
2、提现会产生0%手续费，最低0元，向上取整;{'\n'}
3、支付宝提现2小时内到账;</Text>
</View>
    </View>
<View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),alignItems: 'center',
        gap:px(3)
    }}>
 <TouchableOpacity>
 <LinearGradient
       colors={['#FEC525', '#FC9026']} // 渐变颜色
       start={{ x: 1, y: 0 }}   
       end={{ x: 0, y: 0 }}
       style={styles.payBox}
       >
       <View style={{flexDirection: 'row',alignItems: 'center',}}>
       <Text style={styles.xiadantx}>立即提现</Text>
       </View>
       </LinearGradient>
       </TouchableOpacity>
       <Text style={styles.bodes}>今日剩余提现次数：1次</Text>
    </View>
 
</View>



   <CustomModal visible={visible} onClose={() => setVisible(false)}
    width={px(323)} isclose={true}>
    <Text style={styles.destitle}>支付宝提现信息</Text>
<View style={{width: px(291),height: px(60),backgroundColor: '#EEEEEE',
  borderRadius: px(30),marginTop: px(23),flexDirection: 'row',alignItems: 'center',
}}>
  <Text style={styles.nametx}>姓名</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: "#767676",
    marginLeft: px(8),
  }}></View>
     <TextInput
     allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={onChangeText}
            value={username || ''}
            placeholder="请输入姓名"
            //keyboardType="number-pad"
            placeholderTextColor="#AAAAAA"
            maxLength={8}
            selectionColor='#FC9026'
          />
</View>
<View style={{width: px(291),height: px(60),backgroundColor: '#EEEEEE',
  borderRadius: px(30),marginTop: px(23),flexDirection: 'row',alignItems: 'center',
}}>
  <Text style={styles.nametx}>账号</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: "#767676",
    marginLeft: px(8),
  }}></View>
     <TextInput
     allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={onnumChangeText}
            value={usernumber || ''}
            placeholder="请输入支付宝账号"
            keyboardType="numbers-and-punctuation"
            placeholderTextColor="#AAAAAA"
            maxLength={22}
            selectionColor='#FC9026'
          />
</View>
<TouchableOpacity
  style={{ marginTop: px(32) }}
  onPress={() => {
    setVisible(false);
  }}
  activeOpacity={0.8}
>
  {
      // 正常渐变按钮
      <LinearGradient
        colors={['#FEC525', '#FC9026']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        <Text style={styles.logintext}>
          提交
        </Text>
      </LinearGradient>
  }
</TouchableOpacity>
  </CustomModal>

   <CustomModal visible={yhkvisible} onClose={() => setYhkvisible(false)}
    width={px(323)} isclose={true}> 
    <Text style={styles.destitle}>银行卡提现信息</Text>
<View style={{width: px(291),height: px(60),backgroundColor: '#EEEEEE',
  borderRadius: px(30),marginTop: px(23),flexDirection: 'row',alignItems: 'center',
}}>
  <Text style={styles.nametx}>账户名称</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: "#767676",
    marginLeft: px(8),
  }}></View>
     <TextInput
     allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={onChangeyhkText}
            value={usernameyhk || ''}
            placeholder="请输入账户名称"
            //keyboardType="number-pad"
            placeholderTextColor="#AAAAAA"
            maxLength={8}
            selectionColor='#FC9026'
          />
</View>
<View style={{width: px(291),height: px(60),backgroundColor: '#EEEEEE',
  borderRadius: px(30),marginTop: px(23),flexDirection: 'row',alignItems: 'center',
}}>
  <Text style={styles.nametx}>银行卡号</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: "#767676",
    marginLeft: px(8),
  }}></View>
     <TextInput
     allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={onnumChangeyhkText}
            value={usernumberyhk || ''} 
            placeholder="请输入银行卡号"
            keyboardType="numbers-and-punctuation"
            placeholderTextColor="#AAAAAA"
            maxLength={22}
            selectionColor='#FC9026'
          />
</View>
<View style={{width: px(291),height: px(60),backgroundColor: '#EEEEEE',
  borderRadius: px(30),marginTop: px(23),flexDirection: 'row',alignItems: 'center',
}}>
  <Text style={styles.nametx}>开户行支行</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: "#767676",
    marginLeft: px(8),
  }}></View>
     <TextInput
     allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={userbranchChangeText}
            value={userbranch || ''}
            placeholder="请输入银行开户行"
            //keyboardType="numbers-and-punctuation"
            placeholderTextColor="#AAAAAA"
            maxLength={22}
            selectionColor='#FC9026'
          />
</View>
<TouchableOpacity
  style={{ marginTop: px(32) }}
  onPress={() => {
    setVisible(false);
    setYhkvisible(false)
  }}
  activeOpacity={0.8}
>
  {
      // 正常渐变按钮
      <LinearGradient
        colors={['#FEC525', '#FC9026']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        <Text style={styles.logintext}>
          提交
        </Text>
      </LinearGradient>
  }
</TouchableOpacity>
  </CustomModal>

        <BottomModal
        visible={visiblemode}
        onClose={() => setVisiblemode(false)}
      >
        <View style={{ padding: px(16)}}>
          <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
            justifyContent: 'center',
          }}>
  <Text style={styles.modaltitle}>请选择</Text>
  <TouchableOpacity style={{position: 'absolute',right:0}}
  onPress={()=>setVisiblemode(false)}>
     <Image source={require('../../../assets/images/my/close.png')} 
        style={{width:px(16),height:px(16)}}></Image>
  </TouchableOpacity>
          </View>


          <Radio.Group
            onChange={onGroupChange}
            value={tixianzanmode}
           >  
        <TouchableOpacity style={{width: '100%',flexDirection: 'row',alignItems: 'center',
          justifyContent: 'space-between',marginTop: px(12),
        }} onPress={()=>handlechoosemode(1)}>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Image source={require('../../../assets/images/home/zfb.png')} 
        style={{width:px(32),height:px(32)}}></Image>
    <Text style={[styles.zfbname,{marginLeft: px(7),}]}>支付宝</Text>
</View>
 <Radio value={1}></Radio>
        </TouchableOpacity>
<View style={{width: '100%',height: px(1),
  backgroundColor: 'rgba(118, 118, 118, 0.2)',marginTop: px(9),}}></View>
   <TouchableOpacity style={{width: '100%',flexDirection: 'row',alignItems: 'center',
          justifyContent: 'space-between',marginTop: px(10),
        }} onPress={()=>handlechoosemode(2)}>
<View style={{flexDirection: 'row',alignItems: 'center',flex: 1,}}>
    <Image source={require('../../../assets/images/my/yhk.png')} 
        style={{width:px(32),height:px(32)}}></Image>
          <Text style={[styles.zfbname,{marginLeft: px(7),}]}>银行卡</Text>
   </View>
    <Radio value={2}></Radio>
        </TouchableOpacity>
          </Radio.Group>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
  justifyContent: 'center',marginTop: px(21),}}>
    <TouchableOpacity onPress={()=>handlechoose()}>
    <LinearGradient
        colors={['#FEC525', '#FC9026']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.choosemodeBox}
      >
        <Text style={styles.choosemodetext}>
          确定
        </Text>
      </LinearGradient>
      </TouchableOpacity>
</View>


        </View>
      </BottomModal>

    </View>
  )
}

const styles = StyleSheet.create({
  choosemodetext:{
fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(20),
  },
      choosemodeBox: {
    width:px(242),
    height: px(38),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  zfbname:{
fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
  },
  modaltitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },
    alltx:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(17),
  },
      inputbox:{
    marginLeft: px(8),
  flexDirection: 'row',
  alignItems: 'center',
  width: px(325),
  height: px(51),
  fontSize: px(14),
    },
  nametx:{
    marginLeft: px(18),
   fontFamily: 'MiSans-Regular',
        fontSize:px(17),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(23),
  },
    logintext:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(18),
    color: '#FFFFFF',
    lineHeight: px(24),
  },
    gradientBox: {
    width:px(291),
    height: px(48),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
        destitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(19),
    color: '#1A1A1A',
    lineHeight: px(25),
    },
    bodes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#9E9E9E',
        fontWeight:'400',
        lineHeight:px(15),
    },
        xiadantx:{
      fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(24),
    },
        payBox:{
      marginTop: px(8),
  width: px(311),
  height: px(44),
  borderRadius: px(30),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
        zfbisdes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:'400',
        lineHeight:px(19),
    },
    zfbdes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:'400',
        lineHeight:px(19),
    },
    zfbtitle:{
       fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#767676',
        fontWeight:'400',
        lineHeight:px(19),
    },
    titletop:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#1A1A1A',
        //fontWeight:500,
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