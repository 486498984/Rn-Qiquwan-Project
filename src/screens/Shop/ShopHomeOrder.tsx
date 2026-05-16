import { StyleSheet, Text, View,TouchableOpacity,Image,TextInput,
    TouchableWithoutFeedback,Keyboard,FlatList,ScrollView,useWindowDimensions,

 } from 'react-native'
import React,{useState,useEffect,useCallback,useRef} from 'react'
import { px } from '../../utils/scaleUtils';
import { TabView, TabBar } from 'react-native-tab-view';
import OrderItem from '../../components/Shop/ShopOrderItem'

// Tab 内容示例
const TabContent = ({ data,navigation }) => {
  //const data = Array.from({ length: 30 }).map((_, i) => `${title} - 订单 ${i + 1}`);

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingHorizontal:px(16),paddingTop:px(4),paddingBottom:px(50) }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: px(12) }} />}
        initialNumToRender={6}          // 初始渲染6条
        maxToRenderPerBatch={6}         // 每次最多渲染6条
        windowSize={5}                  // 可视区域前后缓存（默认21，改小更省性能）
        removeClippedSubviews={true}    // 移除屏幕外组件（提升性能）
        updateCellsBatchingPeriod={50}  // 渲染批次间隔（毫秒）
        getItemLayout={(data, index) => ({
            length: px(206), // 每个item高度（你需要改成真实高度）
            offset: px(206) * index,
            index,
        })}
      renderItem={({ item }) => (
        <OrderItem item={item} navigation={navigation}></OrderItem>
      )}
    />
  );
};
export default function ShopHomeOrder({navigation,route}) {
     const { e } = route.params || {};
    console.log(e);
    const getTabIndexByE = (e) => {
    switch (e) {
      case 1:
        return 1; // 全部
      case 2:
        return 2; // 待付款
      case 3:
        return 3; // 待服务
      case 4:
        return 4; // 待收货
      default:
        return 0;
    }
  };
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(() => getTabIndexByE(e)); 
    const [routes] = useState([
      { key: 'all', title: '全部'},
      { key: 'pending', title: '待服务'},
      { key: 'inService', title: '服务中'},
      { key: 'isSubmit', title: '待确认'},
      { key: 'isFinish', title: '已完成'},
    ]);
  const handleback = () => {  //返回上一页
   navigation.goBack();
  };
  const [username, setUsername] = useState(null);
  const onChangeText = (e) => { 
      console.log(e);
      setUsername(e)
    };
      const renderScene = ({ route }) => {
    switch (route.key) {
      case 'all':
        return <TabContent 
        data={[{title:213,type:0,types:1},{title:213,type:1,types:2},
        {title:213,type:2,types:4},{title:213,type:3,types:3},{title:213,type:4,types:2},
        ]} navigation={navigation}
        />;
      case 'pending':
        return <TabContent 
      data={[{title:213,type:0,types:2},{title:213,type:0,types:3},
        {title:213,type:0,types:4},
        ]} navigation={navigation}
        />;
      case 'inService':
        return <TabContent  
        data={[{title:213,type:1,types:4},{title:213,type:1,types:1},
        {title:213,type:1,types:2},
        ]} navigation={navigation}/>;
      case 'isSubmit':
        return <TabContent 
         data={[{title:213,type:2,types:2},{title:213,type:2,types:1},
        {title:213,type:2,types:3},
        ]} navigation={navigation}/>;
      case 'isFinish':
        return <TabContent 
        data={[{title:213,type:3,types:3},{title:213,type:3,types:1},
        {title:213,type:3,types:4},
        ]} navigation={navigation}/>;
      default:
        return null;
    }
  };
    const renderTabBar = useCallback(
      ({ navigationState, jumpTo }) => {
        const scrollRef = useRef(null);
        const scrollViewWidthRef = useRef(0);
        const TAB_WIDTH = px(58); // 每个标签的固定宽度
        // 自动滚动到当前选中标签
        useEffect(() => {
          const currentIndex = navigationState.index;
          if (scrollRef.current && scrollViewWidthRef.current > 0) {
            // 计算滚动偏移量，使当前标签居中
            const offset =
              currentIndex * TAB_WIDTH -
              (scrollViewWidthRef.current / 2) +
              TAB_WIDTH / 2;
            scrollRef.current.scrollTo({
              x: Math.max(0, offset),
              animated: true,
            });
          }
        }, [navigationState.index]);
  
        const handlePress = (routeKey, index) => {
          jumpTo(routeKey);
          // 点击后立即滚动（useEffect 也会触发，但这里手动触发保证响应更快）
          if (scrollRef.current && scrollViewWidthRef.current > 0) {
            const offset =
              index * TAB_WIDTH -
              (scrollViewWidthRef.current / 2) +
              TAB_WIDTH / 2;
            scrollRef.current.scrollTo({
              x: Math.max(0, offset),
              animated: true,
            });
          }
        };
  
        return (
          <View style={{ }}>
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
              onLayout={(e) => {
                scrollViewWidthRef.current = e.nativeEvent.layout.width;
              }}
            >
              {navigationState.routes.map((route, idx) => {
                const isActive = navigationState.index === idx;
                return (
                  <TouchableOpacity
                    key={route.key}
                    style={{
                      height: px(53),
                      width: TAB_WIDTH,
                      alignItems: 'center',
                      justifyContent: 'center',
                      
                    }}
                    onPress={() => handlePress(route.key, idx)}
                    activeOpacity={0.7}
                  >
                  
                   
                    <Text
                      style={{
                        fontFamily: isActive ?'MiSans-Medium':'MiSans-Regular',
                        color: isActive ? '#FF9500' : '#1A1A1A',
                        fontSize: px(14),
                        fontWeight:isActive ? 400:400,
                      }}
                    >
                      {route.title}
                    </Text>
                    {isActive && (
                      <View
                        style={{
                          position: 'absolute',
                          bottom:px(10),
                          //marginTop: 4,
                          height: px(4),
                          width: px(22),
                          backgroundColor: '#FF9500',
                          borderRadius: px(20),
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        );
      },
      []
    );
  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
       <View style={{width: px(393),height: px(135),backgroundColor: '#fff',
                  flexDirection: 'column',justifyContent: 'flex-end',
                }}>
                  <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(15),
                    flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                  }}>
     <TouchableOpacity onPress={handleback} style={{  position: 'absolute',
       left: px(16),}}>
       <Image source={require('../../../assets/images/my/left.png')} 
       style={{width:px(22),height:px(22)}}></Image>
       </TouchableOpacity>
       <Text style={styles.title}>订单(3)</Text>
           </View>
           <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
            justifyContent: 'center',marginBottom: px(8),
           }}>
   <View style={{width: px(317),height: px(32),backgroundColor: '#F2F3F5',
            borderRadius: px(20), flexDirection: 'row',alignItems: 'center',
            padding:px(0),
           }}>
     <Image source={require('../../../assets/images/my/search1.png')} 
     style={{width:px(16),height:px(16),marginLeft: px(8),}}></Image>
    <TextInput
    allowFontScaling={false}
    //multiline
    style={styles.inputbox}
    onChangeText={onChangeText}
    value={username || ''}
    placeholder="搜索"
    //keyboardType="number-pad"
    placeholderTextColor="#AAAAAA"
    maxLength={20}
    selectionColor='#FC9026'
    //textAlignVertical="top"  
    />
           </View>
           </View>
        
         </View>

    <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />


    </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  inputbox:{
  //backgroundColor: 'red',
  //textAlignVertical: 'top', // Android 必须
  paddingTop:0,
  paddingBottom:0,
  //backgroundColor: 'red',
    marginLeft: px(7),
  // flexDirection: 'row',
  // alignItems: 'center',
  width: px(225),
  height: px(32),
  fontSize: px(12),
  fontFamily: 'MiSans-Regular',
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
        backgroundColor: '#F7F8FC',
    }
})