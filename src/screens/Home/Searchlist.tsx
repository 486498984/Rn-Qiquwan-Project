import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import request from '../../api/request';
import { px } from '../../utils/scaleUtils';
import ClubItem from '../../components/Club/ClubItem';
import ShopItem from '../../components/Home/ShopItem';

export default function Searchlist({ navigation, route }) {
  const [shoplist, setShoplist] = useState([]);
  const [clublist, setClublist] = useState([]);
  const [tempUsername, setTempUsername] = useState('');

  const { type,id } = route.params || {};

  const handleback = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (type == 1) {
      getshoplist();
    } else if (type == 2) {
      getclublist();
    }
  }, [type]);

  // 商品列表
  const getshoplist = async (keyword = '') => {
    try {
      const response = await request({
        url: '/goods/list',
        method: 'GET',
        query: {
          keyword,
          page: 1,
          pageSize: 10,
          storeId:id,
        },
      });

      console.log(response);

      if (response.code === 0 && response.data) {
        setShoplist(response.data.list || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 店铺列表
  const getclublist = async (keyword = '') => {
    try {
      const response = await request({
        url: '/store/app/list',
        method: 'GET',
        query: {
          storeName: keyword,
          page: 1,
          pageSize: 10,
        },
      });

      console.log(response);

      if (response.code === 0 && response.data) {
        setClublist(response.data.list || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 搜索
  const handleSearch = () => {
    if (type == 1) {
      getshoplist(tempUsername);
    } else {
      getclublist(tempUsername);
    }
  };

  // 清空
  const handleClear = () => {
    setTempUsername('');

    if (type == 1) {
      getshoplist('');
    } else {
      getclublist('');
    }
  };

  return (
    <View style={styles.container}>
      {/* 顶部 */}
      <View
        style={{
          width: px(393),
          height: px(98),
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <View
          style={{
            width: '100%',
            paddingHorizontal: px(16),
            marginBottom: px(18),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={handleback}
            style={{
              position: 'absolute',
              left: px(16),
            }}
          >
            <Image
              source={require('../../../assets/images/my/left.png')}
              style={{ width: px(22), height: px(22) }}
            />
          </TouchableOpacity>

          <Text style={styles.title}>搜索</Text>
        </View>
      </View>

      {/* 搜索框 */}
      <View
        style={{
          paddingHorizontal: px(16),
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom:px(8)
        }}
      >
        <View
          style={{
            width: px(313),
            height: px(45),
            borderRadius: px(4),
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: px(8),
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Image
              source={require('../../../assets/images/home/search.png')}
              style={{ width: px(22), height: px(22) }}
            />

            <TextInput
              autoFocus
              allowFontScaling={false}
              style={styles.inputbox}
              onChangeText={setTempUsername}
              value={tempUsername}
              placeholder="请输入搜索内容"
              placeholderTextColor="rgba(255, 255, 255,0.7)"
              maxLength={22}
              selectionColor="#FC9026"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />

            {!!tempUsername && (
              <TouchableOpacity onPress={handleClear}>
                <Image
                  source={require('../../../assets/images/home/sclose.png')}
                  style={{ width: px(22), height: px(22) }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={handleSearch}>
          <Text style={styles.righttext}>搜索</Text>
        </TouchableOpacity>
      </View>

      {/* 列表 */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: px(16),
          paddingTop: px(8),
          paddingBottom: px(30),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 商品 */}
        {type == 1 &&
          shoplist.map((item, index) => {
            return (
               <View style={{ paddingHorizontal: px(0), marginBottom: px(16) }}
                   key={item.id || index}>
              <ShopItem
            
                item={item}
                navigation={navigation}
              />
              </View>
            );
          })}

        {/* 店铺 */}
        {type == 2 &&
          clublist.map((item, index) => {
            return (
         <View style={{ paddingHorizontal: px(0), marginBottom: px(8) }}
             key={item.id || index}>
              <ClubItem
                key={item.id || index}
                navigation={navigation}
                status={1}
                item={item}
              />
              </View>
            );
          })}

        {/* 空状态 */}
        {((type == 1 && shoplist.length === 0) ||
          (type == 2 && clublist.length === 0)) && (
          <View
            style={{
              alignItems: 'center',
              marginTop: px(80),
            }}
          >
            <Text
              style={{
                fontSize: px(14),
                color: '#999',
              }}
            >
              暂无数据
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  righttext: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },

  inputbox: {
    paddingRight: px(12),
    textAlign: 'left',
    marginLeft: px(8),
    flex: 1,
    height: px(45),
    color: '#FFFFFF',
    fontSize: px(16),
  },

  title: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});