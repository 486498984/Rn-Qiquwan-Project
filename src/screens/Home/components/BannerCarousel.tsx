import React, { memo, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';
import { px } from '../../../utils/scaleUtils';

interface BannerItem {
  imageUrl: string;
  [key: string]: any;
}

interface Props {
  data: BannerItem[];
  onPress?: (item: BannerItem) => void;
}

const BannerCarousel = ({
  data = [],
  onPress,
}: Props) => {
  const [index, setIndex] = useState(0);

  if (!data.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Carousel
          width={px(361)}
          height={px(96)}
          data={data}
          loop
          autoPlay
          autoPlayInterval={3000}
          onProgressChange={(_, absoluteProgress) => {
            setIndex(Math.round(absoluteProgress));
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onPress?.(item)}
            >
              <FastImage
                source={{ uri: item.imageUrl }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          )}
        />

        <View style={styles.dots}>
          {data.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                index === i && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default memo(
  BannerCarousel,
  (prevProps, nextProps) => {
    return (
      prevProps.data === nextProps.data &&
      prevProps.onPress === nextProps.onPress
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: px(16),
  },
  wrapper: {
    position: 'relative',
  },
  image: {
    width: px(361),
    height: px(96),
    borderRadius: px(8),
  },
  dots: {
    position: 'absolute',
    bottom: px(8),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: px(6),
    height: px(6),
    borderRadius: px(3),
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: px(3),
  },
  activeDot: {
    width: px(12),
    backgroundColor: '#fff',
  },
});