import React, {
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { px } from '../../utils/scaleUtils'
import request from '../../api/request';
import Storage from '../../utils/storage';

interface Props{
  visible:boolean;
  onClose:()=>void;
}
export default function GuideModal({
 visible,
 onClose,
}:Props){
const [index,setIndex] = useState(1); //第几步
const [checkgame,setCheckgame] = useState(1); //游戏选择
  const [text, setText] = useState(''); //游戏id
    const [nickname, setNickname] = useState(''); //昵称
    const [account, setAccount] = useState(''); //游戏账号
    const [textFocus,setTextFocus] = useState(false);
const [accountFocus,setAccountFocus] = useState(false);
    const [nicknameFocus, setNicknameFocus] = useState(false);
const [gameArea,setGameArea] = useState('微信');
const [areaVisible,setAreaVisible] = useState(false);
const canNext =
  text.trim().length > 0 &&
  account.trim().length > 0;
const canClickNext =
  index === 1 ||
  (index === 2 && canNext) ||
  (index === 3 && nickname.trim().length > 0);

  const formatGameArea = (area) => {

  switch(area){

    case '微信':
      return '微信';

    case 'QQ':
      return 'qq';

    case 'Steam':
      return 'steam';

    default:
      return area;

  }

};
const handlenext = async() => {
  if(index==1){
  setIndex(2)
  }else if(index==2){
  setIndex(3)
  setAreaVisible(false)
  }else if(index==3){ //正式提交
    setAreaVisible(false)
  console.log('游戏id',text);
  console.log('游戏模式',checkgame);
  console.log('昵称',nickname);
  console.log('账号',account);
  console.log('游戏大区',gameArea);
  try {
    const response = await request({
      url: '/user/preferences/set',
      method: 'POST',
      data:{
      nickName: nickname,
      games:checkgame==1?'王者荣耀':'三角洲行动',
      gameId: text,
      account: account,
      partition: formatGameArea(gameArea)
      },
      query: {}
    });
  console.log('apiuserinfo',response); 
    if(response.data!==undefined&&response.code==0){
    await Storage.set('preferences', true);
    onClose();
    }
  } catch (error) {
    console.error(error);
  }
  }
 };
const jumpover = async() => { 
await Storage.set('preferences', true);
onClose()
 };
return (
<Modal
visible={visible}
animationType="fade"
transparent={false}
statusBarTranslucent
//onRequestClose={onClose}
onRequestClose={()=>{}}
>
  <TouchableWithoutFeedback
onPress={()=>{
  Keyboard.dismiss();

  setTextFocus(false);
  setAccountFocus(false);
  setNicknameFocus(false);
}}
 >
<View style={styles.container}>



{index==1&&
<View style={{marginTop: px(58),}}>
  <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
<TouchableOpacity style={{marginRight: px(34),}} onPress={()=>jumpover()}>
<Text style={styles.jumpover}>跳过</Text>
</TouchableOpacity>
  </View>

<View style={{flexDirection: 'column',marginLeft: px(34),gap:px(10),marginTop: px(31),}}>
<Text style={styles.toptext}>Hi，很高兴见到您</Text>
<Text style={styles.setoptext}>您常玩的游戏是？</Text>
</View>

<View style={{flexDirection: 'column',alignItems: 'center',gap:px(21),marginTop: px(27),}}>
<TouchableOpacity style={checkgame==1?styles.ischeckbox:styles.nocheckbox}
onPress={()=>setCheckgame(1)} activeOpacity={0.9}>
  <Image source={require('../../../assets/images/home/wangzhe.png')} 
  style={{width:px(47),height:px(47),marginLeft: px(23),}}></Image>
  <View style={{flexDirection: 'column',marginLeft: px(15),gap:px(7)}}>
<Text style={styles.gamename}>王者荣耀</Text>
<Text style={styles.gamenamedes}>野王哥哥千千万，不如甜妹陪你转</Text>
  </View>
</TouchableOpacity>
<TouchableOpacity style={checkgame==2?styles.ischeckbox:styles.nocheckbox}
onPress={()=>setCheckgame(2)} activeOpacity={0.9}>
 <Image source={require('../../../assets/images/home/sanjiao.png')} 
  style={{width:px(47),height:px(47),marginLeft: px(23),}}></Image>
    <View style={{flexDirection: 'column',marginLeft: px(15),gap:px(7)}}>
<Text style={styles.gamename}>三角洲行动</Text>
<Text style={styles.gamenamedes}>考核严选，专业护航，平台保障</Text>
  </View>
</TouchableOpacity>

</View>

</View>
}
{index==2&&
<View style={{marginTop: px(58),}}>
  <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
  <TouchableOpacity style={{marginLeft: px(31),}} onPress={()=>setIndex(1)}>
  <Image source={require('../../../assets/images/my/left.png')} 
style={{width:px(21),height:px(21)}}></Image>
</TouchableOpacity>
<TouchableOpacity style={{marginRight: px(34),}} onPress={()=>jumpover()}>
<Text style={styles.jumpover}>跳过</Text>
</TouchableOpacity>
  </View>

<View style={{flexDirection: 'column',marginLeft: px(34),gap:px(10),marginTop: px(31),}}>
<Text style={styles.toptext}>Hi，很高兴见到您</Text>
<Text style={styles.setoptext}>您的相关账号信息是？</Text>
</View>

<View style={{flexDirection: 'column',alignItems: 'center',gap:px(21),marginTop: px(31),}}>
<View
style={[
  styles.inputbox,
  textFocus && styles.focusInputbox
]}
>
<TextInput
value={text}
onChangeText={setText}
placeholder="游戏ID"
style={styles.input}
maxLength={16}
placeholderTextColor="#999"
onFocus={()=>{
  setTextFocus(true);
}}
onBlur={()=>{
  setTextFocus(false);
}}
  selectionColor="#FEC525"
/>
{
text.length>0 &&
<TouchableOpacity
onPress={()=>setText('')}
style={{
paddingRight:px(16)
}}
>
<Image source={require('../../../assets/images/my/closein.png')} 
style={{width:px(21),height:px(21)}}></Image>
</TouchableOpacity>
}
</View>
<View
style={[
  styles.inputbox,
  accountFocus && styles.focusInputbox
]}
>
<TextInput
value={account}
onChangeText={setAccount}
placeholder="游戏账号"
style={styles.input}
maxLength={16}
placeholderTextColor="#999"
onFocus={()=>{
  setAccountFocus(true);
}}
onBlur={()=>{
  setAccountFocus(false);
}}
  selectionColor="#FEC525"
/>
{
account.length>0 &&
<TouchableOpacity
onPress={()=>setAccount('')}
style={{
paddingRight:px(16)
}}
>
<Image source={require('../../../assets/images/my/closein.png')} 
style={{width:px(21),height:px(21)}}></Image>
</TouchableOpacity>
}
</View>

<TouchableOpacity
activeOpacity={0.8}
onPress={()=>setAreaVisible(!areaVisible)}
style={[
styles.inputbox,
{
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between',
paddingRight:px(16),
borderColor: areaVisible?'#FEC525':'#D8D8D8',
}
]}
>
<Text
style={[
styles.gamequ,
gameArea!=='游戏分区' && {
color:'#1A1A1A'
}
]}
>
{gameArea}
</Text>
<Image
source={
areaVisible
?
require('../../../assets/images/my/gameseb.png')
:
require('../../../assets/images/my/gamese.png')
}
style={{
width:px(21),
height:px(21)
}}
/>
</TouchableOpacity>
{
areaVisible &&
<View style={styles.areaBox}>


{
['微信','QQ','Steam'].map((item,index)=>(


<React.Fragment key={item}>


<TouchableOpacity

activeOpacity={0.8}

onPress={()=>{

  setGameArea(item);

  setAreaVisible(false);

}}

style={[
  styles.areaItem,

  gameArea===item && {
    backgroundColor:'#FFF3D1',
  }

]}


>


<Text style={styles.areaText}>
{item}
</Text>


</TouchableOpacity>



{
index !== 2 &&

<View
style={{
width:px(283),
height:px(1),
backgroundColor:'#D8D8D8',
alignSelf:'center',
}}
/>

}


</React.Fragment>


))


}


</View>
}
</View>  
</View>
}
{index==3&&
<View style={{marginTop: px(58),}}>
  <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
  <TouchableOpacity style={{marginLeft: px(31),}} onPress={()=>setIndex(2)}>
  <Image source={require('../../../assets/images/my/left.png')} 
style={{width:px(21),height:px(21)}}></Image>
</TouchableOpacity>
<TouchableOpacity style={{marginRight: px(34),}} onPress={()=>jumpover()}>
<Text style={styles.jumpover}>跳过</Text>
</TouchableOpacity>
  </View>

<View style={{flexDirection: 'column',marginLeft: px(34),gap:px(10),marginTop: px(31),}}>
<Text style={styles.toptext}>Hi，很高兴见到您</Text>
<Text style={styles.setoptext}>设置一个您喜欢的昵称~</Text>
</View>

<View style={{flexDirection: 'column',alignItems: 'center',gap:px(21),marginTop: px(31),}}>
<View
style={[
  styles.inputbox,
  nicknameFocus && styles.focusInputbox
]}
>
<TextInput
value={nickname}
onChangeText={setNickname}
placeholder="昵称"
style={styles.input}
maxLength={12}
placeholderTextColor="#999"
onFocus={()=>{
  setNicknameFocus(true);
}}
onBlur={()=>{
  setNicknameFocus(false);
}}
  selectionColor="#FEC525"
/>
{
nickname.length>0 &&
<TouchableOpacity
onPress={()=>setNickname('')}
style={{
paddingRight:px(16)
}}
>
<Image source={require('../../../assets/images/my/closein.png')} 
style={{width:px(21),height:px(21)}}></Image>
</TouchableOpacity>
}
</View>

</View>  
</View>
}

<View style={{position: 'absolute',bottom:px(142),alignItems: 'center',width: '100%',gap:px(13)}}>
<Text style={styles.gamenamedes}>为了快速为您服务，我们需要收集一些您的信息</Text>
<TouchableOpacity style={{width: px(331),height: px(48),  backgroundColor:
    canClickNext
    ?
    '#FEC525'
    :
    '#D8D8D8',borderRadius: px(24),
  flexDirection: 'row',alignItems: 'center',justifyContent: 'center'
}} onPress={()=>handlenext()} activeOpacity={canNext ? 0.8 : 1}

disabled={!canClickNext}>
<Text style={styles.nexttext}>{index==3?'完成':'下一步'}</Text>
</TouchableOpacity>
</View>

</View>
</TouchableWithoutFeedback>
</Modal>
)
}
const styles=StyleSheet.create({
areaBox:{
  width:px(333),
  //height:px(159),
  backgroundColor:'#FFFFFF',
  borderRadius:px(24),
  // iOS 阴影
  shadowColor:'#000',
  shadowOffset:{
    width:0,
    height:px(4),
  },
  shadowOpacity:0.2,
  shadowRadius:px(20),
  // Android 阴影
  elevation:8,
  alignItems: 'center',
  zIndex: 999,
  gap:px(2),
  paddingVertical:px(2),
  marginTop: -px(21),
},



areaItem:{


height:px(52),


width:px(329),


borderRadius:px(24),


alignItems:'center',

justifyContent:'center',


},



areaText:{


fontFamily:'MiSans-Regular',

fontSize:px(16),

color:'#1A1A1A',

lineHeight:px(21),


},
  gamequ:{
fontFamily: 'MiSans-Regular', 
fontSize:px(16),
lineHeight:px(21),
 color:'#AAAAAA', 
 fontWeight:400,
  },
  focusInputbox:{
  borderColor:'#FEC525',
},
inputbox:{
  width:px(331),
  height:px(71),
  borderWidth:px(1.5),
  borderColor:'#D8D8D8',
  borderRadius:px(24),
  justifyContent:'center',
  paddingLeft:px(16),

  flexDirection:'row',
  alignItems:'center',
},
    input: {
    flex: 1,
    height: px(62),
    paddingHorizontal: px(0),
    fontSize: px(14),
    //backgroundColor: 'red',
  },
  nexttext:{
    fontFamily: 'MiSans-Medium', 
    fontSize:px(18), 
    color:'#FFFFFF', 
    //fontWeight:'400', 
    lineHeight:px(24),
  },
  gamenamedes:{
fontFamily: 'MiSans-Regular', 
fontSize:px(13),
lineHeight:px(17),
 color:'#9E9E9E', 
 fontWeight:400,
  },
  gamename:{
fontFamily: 'MiSans-Bold', 
fontSize:px(20),
lineHeight:px(28),
 color:'#1A1A1A', 
  },
  ischeckbox:{
  width: px(333),
  height: px(101),
  backgroundColor: '#FFFFFF',
  borderRadius: px(24),
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: px(1.5),
  borderColor: '#FEC525',
  },
  nocheckbox:{
  width: px(333),
  height: px(101),
  backgroundColor: '#F2F3F5',
  borderRadius: px(24),
  flexDirection: 'row',
  alignItems: 'center',
  },
  setoptext:{
fontFamily: 'MiSans-Regular', 
fontSize:px(23),
lineHeight:px(30),
 color:'#1A1A1A', 
 fontWeight:400,
  },
  toptext:{
fontFamily: 'MiSans-Regular', 
fontSize:px(18),
lineHeight:px(24),
 color:'#9E9E9E', 
 fontWeight:400,
  },
  jumpover:{
fontFamily: 'MiSans-Regular', 
fontSize:px(18),
lineHeight:px(24),
 color:'#1A1A1A', 
 fontWeight:400,
  },
container:{
flex:1,
backgroundColor:'#fff',
},
});