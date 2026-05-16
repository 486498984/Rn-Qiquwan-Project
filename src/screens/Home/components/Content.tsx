import React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { px } from "../../../utils/scaleUtils";
import ShopItem from "../../../components/Home/ShopItem";

const Content = ({ data, navigation, loadMore }) => {

  return (
  <FlatList
  onMomentumScrollBegin={() => {}}
  scrollEnabled={false}
  data={data.list}
  keyExtractor={(item, i) => i.toString()}

  renderItem={({ item }) => (
    <View style={{ paddingHorizontal: px(16), marginBottom: px(16) }}>
      <ShopItem item={item} navigation={navigation} />
    </View>
  )}

  onEndReached={loadMore}
  onEndReachedThreshold={0.2}

  // ✅ 空状态
  ListEmptyComponent={() => {
    if (data.loading) return null;

    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>暂无内容</Text>
      </View>
    );
  }}

  // ✅ 底部状态
  ListFooterComponent={() => {
    if (data.loading) {
      return <ActivityIndicator style={{ margin: px(16) }} />;
    }

    if (!data.hasMore && data.list.length > 0) {
      return (
        <Text style={[styles.smadestitle, { textAlign: "center" }]}>
          我是有底线的～
        </Text>
      );
    }

    return null;
  }}
/>
  );
};

export default React.memo(Content);
const styles = StyleSheet.create({
  emptyBox: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: px(40),
},

emptyText: {
   fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
},
    smadestitle:{
        fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
    },
  })