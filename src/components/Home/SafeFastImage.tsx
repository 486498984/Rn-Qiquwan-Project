import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
} from 'react-native';

import FastImage from 'react-native-fast-image';

const SafeFastImage = ({
  source,
  fallbackSource = require('../../../assets/images/home/imgfail.png'),
  ...props
}) => {

  // 是否为网络图片
  const isRemoteImage =
    typeof source === 'object' &&
    source !== null &&
    !!source.uri;

  const imageUri =
    isRemoteImage
      ? source.uri
      : null;

  const [failed, setFailed] =
    useState(false);

  const [reloadKey, setReloadKey] =
    useState(0);

  const retryCountRef =
    useRef(0);

  const timerRef =
    useRef(null);

  useEffect(() => {

    retryCountRef.current = 0;

    setFailed(false);

    setReloadKey(0);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

  }, [imageUri, source]);

  const handleError = () => {

    /**
     * 本地图片加载失败，
     * 没必要进行网络重试。
     */
    if (!isRemoteImage) {
      setFailed(true);
      return;
    }

    /**
     * 网络图片最多重试3次
     */
    if (retryCountRef.current < 3) {

      retryCountRef.current += 1;

      const delay =
        retryCountRef.current * 600;

      timerRef.current =
        setTimeout(() => {

          setReloadKey(prev =>
            prev + 1,
          );

        }, delay);

      return;
    }

    setFailed(true);
  };

  /**
   * source完全为空
   */
  if (!source) {
    return (
      <View
        style={props.style}
      />
    );
  }

  return (
    <FastImage
      key={
        isRemoteImage
          ? `${imageUri}_${reloadKey}`
          : `local_${String(source)}`
      }
      {...props}
      source={
        failed
          ? fallbackSource
          : source
      }
      onError={handleError}
    />
  );
};

export default SafeFastImage;