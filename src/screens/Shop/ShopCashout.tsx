import { StyleSheet, Text, View,TouchableOpacity,Image,Platform,TextInput,

 } from 'react-native'
import React,{useState,useEffect,} from 'react'
import { px } from '../../utils/scaleUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import CustomModal from '../../components/My/CustomModal';
import BottomModal from '../../components/My/BottomModal';
import {
  Radio,Modal as Modalitem,
} from '@ant-design/react-native'
import request from '../../api/request';
import { Toast } from '@ant-design/react-native'



export default function ShopCashout({ navigation,route }) {
    const { id } = route.params || {}
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
const [withdmoney, setWithdmoney] = useState(0); //可提现金额
const [fee, setFee] = useState(0);
const [tempUsername, setTempUsername] = useState('');
const [tempUsernumber, setTempUsernumber] = useState('');
const [tempUsernameyhk, setTempUsernameyhk] = useState('');
const [tempUsernumberyhk, setTempUsernumberyhk] = useState('');
const [tempUserbranch, setTempUserbranch] = useState('');
const [accountList, setAccountList] = useState([]); // 保存账户列表



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
  if(tixianmode == 1){
    setTempUsername(username || '');
    setTempUsernumber(usernumber || '');
    setVisible(true);
  } else {
    setTempUsernameyhk(usernameyhk || '');
    setTempUsernumberyhk(usernumberyhk || '');
    setTempUserbranch(userbranch || '');
    setYhkvisible(true);
  }

    };
    useEffect(() => {
      if(id){
      getwithlist(id);
      getmoney(id);
      }
    

    }, [id])
     const getmoney = async(e) => { 
              try {
            const response = await request({
              url: '/store/dashboard/fund',
              method: 'GET',
              data: {
              },
              query: {storeId:e},
            }); 
            console.log('storeauth',response);
          if (response.data !== null && response.code == 0) {
          setWithdmoney(response.data.withdrawableAmount/100)
                // 计算手续费
      const calculatedFee = Math.max(1, Math.ceil(response.data.withdrawableAmount/100 * 0.01));
      setFee(calculatedFee);
          } 
          } catch (error) {
            console.error(error);
          }
    
      };
    const getwithlist = async(id) => { 
    console.log(id);
              try {
            const response = await request({
              url: '/withdraw/account/list',
              method: 'GET',
              data: {
              },
              query: {ownerId:id,
                ownerType:'STORE'
              },
            }); 
            console.log('storeauth',response);
    if (response.data && response.data.length > 0) {
       setAccountList(response.data); // 保存到账户列表
      // 遍历账户列表，找默认账户
      const alipayAccount = response.data.find(item => item.type === 'ALIPAY' && item.isDefault === 1);
      const bankAccount = response.data.find(item => item.type === 'BANK' && item.isDefault === 1);
      if (alipayAccount) {
        setUsername(alipayAccount.accountName); // 支付宝姓名
        setUsernumber(alipayAccount.account); // 支付宝账号
      }
      if (bankAccount) {
        setUsernameyhk(bankAccount.accountName); // 银行卡姓名
        setUsernumberyhk(bankAccount.account); // 银行卡账号
        setUserbranch(bankAccount.bankName); // 支行名称
      }
      // 默认提现模式根据第一个账户类型
      //if (alipayAccount) setTixianmode(1);
      //else if (bankAccount) setTixianmode(2);
    } else {
      // 没有提现账户，输入框保持空
      setUsername('');
      setUsernumber('');
      setUsernameyhk('');
      setUsernumberyhk('');
      setUserbranch('');
    }
          } catch (error) {
            console.error(error);
          }
     };
       const syncWithdrawAccount = async () => {
      try {
        const response = await request({
          url: '/withdraw/account/list',
          method: 'GET',
          query: {
            ownerId: id,
            ownerType: 'STORE',
          },
        });

    const accounts = response.data || [];

    // 查找支付宝和银行卡账户
    const alipayAccount = accounts.find(a => a.type === 'ALIPAY');
    const bankAccount = accounts.find(a => a.type === 'BANK');
   console.log(alipayAccount,bankAccount);
   
    // 如果账户不存在，新增
    if (!alipayAccount && tixianmode === 1) {
      console.log(213222,tempUsernumber,tempUsername);
      
   const addResponse = await request({
        url: '/withdraw/account/add',
        method: 'POST',
        data: {
          ownerId: id,
          ownerType: "STORE",
          type: "ALIPAY",
          account: tempUsernumber,
          accountName: tempUsername,
          //bankName: "",
          isDefault: 1
        },
      });
      if(addResponse.data&&addResponse.code==0){
      setUsername(tempUsername);
      setUsernumber(tempUsernumber);
      setVisible(false);
        Toast.success({
            content: '添加成功',
            duration: 2,
            position: 'center',
            mask: false,
          })
          getwithlist(id);
      }else{
       setVisible(false);
        Toast.fail({
          content: addResponse.data,
          duration: 2,
          position: 'center',
          mask: false,
        })
              getwithlist(id);
        }
        console.log('Add account response:', addResponse);
    } else if (alipayAccount && tixianmode === 1) {
      console.log(2113,tempUsernumber,tempUsername);
      
      // 编辑支付宝，使用列表中的id
   const addResponse=   await request({
        url: '/withdraw/account/update',
        method: 'PUT',
        data: {
          id: alipayAccount.id,
          ownerId: id,
          ownerType: "STORE",
          type: "ALIPAY",
          account: tempUsernumber,
          accountName: tempUsername,
          //bankName: "",
          isDefault: 1
        },
      });
      console.log(addResponse);
      
     if(addResponse.data&&addResponse.code==0){
      setUsername(tempUsername);
      setUsernumber(tempUsernumber);
      setVisible(false);
        Toast.success({
            content: '修改成功',
            duration: 2,
            position: 'center',
            mask: false,
          })
          getwithlist(id);
      }else{
       setVisible(false);
      Toast.fail({
        content: addResponse.data,
        duration: 2,
        position: 'center',
        mask: false,
      })
        getwithlist(id);
  }
    }

    if (!bankAccount && tixianmode === 2) {
    const addResponse=  await request({
        url: '/withdraw/account/add',
        method: 'POST',
        data: {
          ownerId: id,
          ownerType: "STORE",
          type: "BANK",
          account: tempUsernumberyhk,
          accountName: tempUsernameyhk,
          bankName: tempUserbranch,
          isDefault: 1
        },
      });
      if(addResponse.data&&addResponse.code==0){
      setUsernameyhk(tempUsernameyhk);
      setUsernumberyhk(tempUsernumberyhk);
      setUserbranch(tempUserbranch);
      setYhkvisible(false);
        Toast.success({
            content: '添加成功',
            duration: 2,
            position: 'center',
            mask: false,
          })
          getwithlist(id);
          setTixianmode(2)
      }else{
      setYhkvisible(false);
      Toast.fail({
        content: addResponse.data,
        duration: 2,
        position: 'center',
        mask: false,
      })
        setTixianmode(2)
        getwithlist(id);
  }
    } else if (bankAccount && tixianmode === 2) {
      // 编辑银行卡
     const addResponse= await request({
        url: '/withdraw/account/update',
        method: 'PUT',
        data: {
          id: bankAccount.id,
          ownerId: id,
          ownerType: "STORE",
          type: "BANK",
          account: tempUsernumberyhk,
          accountName: tempUsernameyhk,
          bankName: tempUserbranch,
          isDefault: 1
        },
      });
      if(addResponse.data&&addResponse.code==0){
      setUsernameyhk(tempUsernameyhk);
      setUsernumberyhk(tempUsernumberyhk);
      setUserbranch(tempUserbranch);
      setYhkvisible(false);
        Toast.success({
            content: '修改成功',
            duration: 2,
            position: 'center',
            mask: false,
          })
          getwithlist(id);
           setTixianmode(2)
      }else{
      setYhkvisible(false);
      Toast.fail({
        content: addResponse.data,
        duration: 2,
        position: 'center',
        mask: false,
       })
        getwithlist(id);
        setTixianmode(2)
      }
        }

      } catch (error) {
        console.error(error);
        Toast.show('操作失败');
        getwithlist(id);
      }
       };
       const handlesubmit = () => { 
        if(withdmoney<=0){
         Toast.show({
          content: '提现金额必须大于0.1元',
          duration: 2,
          position: 'center',
          mask: false,
        })
          return
        }

        // 获取当前选择账户
      let selectedAccount;
      if (tixianmode === 1) {
        selectedAccount = accountList.find(a => a.type === 'ALIPAY');
      } else {
        selectedAccount = accountList.find(a => a.type === 'BANK');
      }

      if (!selectedAccount) {
        Toast.show('请先添加提现账户');
        return;
      }
           Modalitem.alert('提示', '是否提交？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handlesubmits(selectedAccount),
       style: { color: '#FC9026' },
       },
      ])
      }
        const handlesubmits = async(selectedAccount) => { 
          // 获取当前选择账户
          // let selectedAccount;
          // if (tixianmode === 1) {
          //   selectedAccount = accountList.find(a => a.type === 'ALIPAY');
          // } else {
          //   selectedAccount = accountList.find(a => a.type === 'BANK');
          // }

          // if (!selectedAccount) {
          //   Toast.show('请先添加提现账户');
          //   return;
          // }
          console.log('当前选择提现账户ID:', selectedAccount.id);
                      try {
                    const response = await request({
                      url: '/withdraw/apply',
                      method: 'POST',
                      data: {
                      ownerId: id,
                      ownerType: "STORE",
                      applyAmount: withdmoney*100,
                      payeeAccountId: selectedAccount.id
                      },
                      query: {},
                    }); 
                    console.log('storeauth',response);
                  if (response.data !== null && response.code == 0) {
                    getmoney(id)
                    Toast.success({
                          content: '提交成功，请耐心等待审核',
                          duration: 2,
                          position: 'center',
                          mask: false,
                        })
                  } else{
                          Toast.fail({
                            content: response.data,
                            duration: 2,
                            position: 'center',
                            mask: false,
                          })
                  }
                  } catch (error) {
                    console.error(error);
                  }
        }
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
            <TouchableOpacity   style={{position: 'absolute',
            right: px(16),flexDirection: 'row',alignItems: 'center',height:px(35),
            }} onPress={()=>navigation.navigate('ShopCashItem',{id:id,type:'STORE'})}>
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
<Text style={usernumber?styles.zfbisdes:styles.zfbdes}>{usernumber?usernumber:'提现账户名必须与工作室主体名称一致'}</Text>
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
  <Text style={styles.titletop}>{withdmoney}</Text>
</View>
  <Text style={styles.zfbdes}>可提现:{withdmoney}</Text>
</View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',padding:px(16),
    marginTop: px(16),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
 <Text style={styles.titletop}>手续费</Text>
<Text style={styles.zfbdes}>￥{fee}</Text>
    </View>

<View style={{width: '100%',backgroundColor: '#fff',padding:px(16),
    marginTop: px(16),gap:px(16)}}>
 <Text style={styles.titletop}>提现须知</Text>
<View>
      <Text style={styles.zfbdes}>
        1、每日默认提现1次;{'\n'}
2、提现会产生1%手续费，最低1元，向上取整;{'\n'}
3、支付宝提现2小时内到账;</Text>
</View>
    </View>
<View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),alignItems: 'center',
        gap:px(3)
    }}>
 <TouchableOpacity onPress={()=>handlesubmit()}>
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
       {/* <Text style={styles.bodes}>今日剩余提现次数：1次</Text> */}
    </View>
 
</View>



   <CustomModal visible={visible} onClose={() => setVisible(false)}
    width={px(323)} isclose={true}>
    <Text style={styles.destitle}>支付宝提现信息</Text>
<View style={{width: px(291),height: px(60),backgroundColor: '#EEEEEE',
  borderRadius: px(30),marginTop: px(23),flexDirection: 'row',alignItems: 'center',
}}>
  <Text style={styles.nametx}>账户名</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: "#767676",
    marginLeft: px(8),
  }}></View>
     <TextInput
     allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={setTempUsername}
            value={tempUsername}
            placeholder="请输入账户名"
            //keyboardType="number-pad"
            placeholderTextColor="#AAAAAA"
            maxLength={22}
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
            onChangeText={setTempUsernumber}
            value={tempUsernumber}
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
 syncWithdrawAccount()
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
            onChangeText={setTempUsernameyhk}
            value={tempUsernameyhk}
            placeholder="请输入账户名称"
            //keyboardType="number-pad"
            placeholderTextColor="#AAAAAA"
            //maxLength={8}
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
            onChangeText={setTempUsernumberyhk}
            value={tempUsernumberyhk} 
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
            onChangeText={setTempUserbranch}
            value={tempUserbranch}
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
 syncWithdrawAccount()

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
        paddingRight:px(12),
        textAlign:'left',
        //backgroundColor:'red',
    marginLeft: px(8),
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  // width: px(300),
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