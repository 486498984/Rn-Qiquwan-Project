import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { px } from "../../utils/scaleUtils";

const fullStar = require("../../../assets/images/club/star.png");
const halfStar = require("../../../assets/images/club/halfstar.png");
const emptyStar = require("../../../assets/images/club/nostar.png");

const StarRating = ({ score = 0, size = 18 }) => {
  const stars = [];

  // ⭐ 满星数量
  const fullCount = Math.floor(score);

  // ⭐ 是否有半星
  const hasHalf = score - fullCount >= 0.5;

  // ⭐ 空星数量
  const emptyCount = 5 - fullCount - (hasHalf ? 1 : 0);

  // 加满星
  for (let i = 0; i < fullCount; i++) {
    stars.push(<Image key={`full-${i}`} source={fullStar} style={[styles.star, { width: px(size), height: px(size) }]} />);
  }

  // 加半星
  if (hasHalf) {
    stars.push(<Image key="half" source={halfStar} style={[styles.star, { width: px(size), height: px(size) }]} />);
  }

  // 加空星
  for (let i = 0; i < emptyCount; i++) {
    stars.push(<Image key={`empty-${i}`} source={emptyStar} style={[styles.star, { width: px(size), height: px(size) }]} />);
  }

  return <View style={styles.container}>{stars}</View>;
};

export default React.memo(StarRating);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginRight: px(0),
  },
});