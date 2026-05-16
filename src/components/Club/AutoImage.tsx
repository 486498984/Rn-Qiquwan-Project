import React, { useEffect, useState } from 'react';
import {
  Image,
  Dimensions,
} from 'react-native';

import { px } from '../../utils/scaleUtils';

const screenWidth = Dimensions.get('window').width;

// 默认图片
const defaultImage = require('../../../assets/images/home/imgfail.png');

export default function AutoImage({ uri }) {

  // 固定宽度
  const imageWidth = screenWidth - px(32);

  // 默认高度
  const [height, setHeight] = useState(px(200));

  // 当前图片
  const [imgSource, setImgSource] = useState(
    uri ? { uri } : defaultImage
  );

  useEffect(() => {

    if (!uri) {
      setImgSource(defaultImage);
      return;
    }

    Image.getSize(
      uri,
      (width, height) => {

        // 按比例计算高度
        const autoHeight = imageWidth * height / width;

        setHeight(autoHeight);

        setImgSource({ uri });
      },
      () => {

        // 获取失败用默认图
        setImgSource(defaultImage);

        // 默认图高度
        setHeight(px(200));
      }
    );

  }, [uri]);

  return (
    <Image
      source={imgSource}
      style={{
        width: imageWidth,
        height,
        //borderRadius: px(12),
        //marginBottom: px(12),
        backgroundColor: '#f5f5f5',
      }}
      resizeMode="contain"

      // 加载失败
      onError={() => {
        setImgSource(defaultImage);
        setHeight(px(200));
      }}
    />
  );
}