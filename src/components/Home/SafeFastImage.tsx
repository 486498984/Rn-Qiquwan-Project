import React, { useState, useEffect } from 'react';
import FastImage from 'react-native-fast-image';

const SafeFastImage = ({
  source,
  fallbackSource = require('../../../assets/images/home/imgfail.png'),
  ...props
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [source?.uri]);

  return (
    <FastImage
      {...props}
      source={imgError ? fallbackSource : source}
      onError={() => setImgError(true)}
    />
  );
};

export default SafeFastImage;