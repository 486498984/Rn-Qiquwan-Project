import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Toast } from '@ant-design/react-native';
import { px } from '../../utils/scaleUtils';
import ImagePreviewer from './ImagePreviewer';
import SafeFastImage from '../../components/Home/SafeFastImage'
import FastImage from 'react-native-fast-image';


export default function ImageUploader({
  value = [],
  onChange,
  max = 4,
}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ 选择图片
  const handleSelectImage = () => {
           Toast.show({
          content: '上传中',
          icon: <ActivityIndicator />,
          mask: true,
          duration:0,

        });
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: max - value.length,
      },
      (response) => {
        Toast.removeAll()
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          return;
        }
        const newImages = response.assets || [];
        onChange && onChange([...value, ...newImages]);
      }
    );
  };

  // ✅ 删除
  const handleDeleteImage = (index) => {
    const newList = value.filter((_, i) => i !== index);
    onChange && onChange(newList);
  };
//const [errorIndexMap, setErrorIndexMap] = useState({});
const [errorMap, setErrorMap] = useState({});
const handleImageError = (uri) => {
  setErrorMap((prev) => ({
    ...prev,
    [uri]: true,
  }));
};
  return (
    <View>
      <View style={styles.imageContainer}>
        {/* 图片列表 */}
        {value.map((item, index) => (
          <View key={index} style={styles.imageBox}>
            <TouchableOpacity
              onPress={() => {
            if (errorMap[item.uri]) {
              Toast.show('该图片无法展示,请重新上传');
              return;
            }
            setCurrentIndex(index);
            setPreviewVisible(true);
          }}
            >
<FastImage
  source={
    errorMap[item.uri]
      ? require('../../../assets/images/home/imgfail.png')
      : {
          uri: item.uri,
          priority: FastImage.priority.normal,
        }
  }
  style={styles.image}
  resizeMode={FastImage.resizeMode.cover}
  onError={() => handleImageError(item.uri)}
/>
            </TouchableOpacity>

            {/* 删除 */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteImage(index)}
            >
              <Text style={{ color: '#fff', fontSize: px(12) }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* 添加 */}
        {value.length < max && (
          <TouchableOpacity
            style={styles.addBox}
            onPress={handleSelectImage}
          >
            <Text style={{ fontSize: px(24), color: '#999' }}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 数量 */}
      <View style={{ alignItems: 'flex-end', marginTop: px(4) }}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
        <Text style={styles.count}>{value.length}</Text>
        <Text style={styles.countf}>
          /{max}
        </Text>
        </View>
      </View>

      {/* 预览组件 */}
      <ImagePreviewer
        visible={previewVisible}
        images={value}
        index={currentIndex}
        onClose={() => setPreviewVisible(false)}
        enableLongPressSave={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: px(12),
  },

  imageBox: {
    width: px(80),
    height: px(80),
    marginRight: px(8),
    marginBottom: px(8),
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: px(8),
  },

  addBox: {
    width: px(80),
    height: px(80),
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(6),
  },

  deleteBtn: {
    position: 'absolute',
    top: px(4),
    right: px(4),
    width: px(18),
    height: px(18),
    borderRadius: px(9),
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
    countf:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(19),
    },
    count:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(19),
    },
});