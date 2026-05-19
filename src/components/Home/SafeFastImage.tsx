import React, { useState, useEffect } from 'react';
import FastImage from 'react-native-fast-image';

const SafeFastImage = ({
  source,
  fallbackSource = require('../../../assets/images/home/imgfail.png'),
  ...props
}) => {

  const [imgError, setImgError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
 
    setImgError(false);
    setRetryKey(0);

  }, [source?.uri]);

  const handleError = () => {

    // 先重试一次
    if (retryKey < 1) {

      setTimeout(() => {
        setRetryKey(prev => prev + 1);
      }, 1000);

      return;
    }

    // 真失败才显示默认图
    setImgError(true);
  };

  return (
    <FastImage
      key={retryKey}
      {...props}
      source={
        imgError
          ? fallbackSource
          : source
      }
      onError={handleError}
    />
  );
};

export default SafeFastImage;