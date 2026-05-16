import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import { Checkbox } from '@ant-design/react-native';
import BottomModal from '../My/BottomModal';

const CheckboxItem = Checkbox.CheckboxItem;

type OptionItem = {
  label: string;
  value: number | string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  data: OptionItem[];
  value: (number | string)[];
  onConfirm: (val: (number | string)[]) => void;
  title?: string;
  showCheckAll?: boolean;
};

export default function TextCheckboxModal({
  visible,
  onClose,
  data = [],
  value = [],
  onConfirm,
  title = '请选择(多选)',
  showCheckAll = true,
}: Props) {

const [checkedList, setCheckedList] = useState<(number | string)[]>([]);

useEffect(() => {
  if (visible) {
    setCheckedList(value || []);
  }
}, [visible, value]);

  // 单个选择
const toggleItem = (val) => {
  setCheckedList(prev =>
    prev.includes(val)
      ? prev.filter(i => i !== val)
      : [...prev, val]
  );
};

  // 是否全选
  const isAllChecked = checkedList.length === data.length;

  // 是否半选
  const isIndeterminate =
    checkedList.size > 0 && checkedList.size < data.length;

  // 全选/取消全选
  const toggleAll = () => {
    if (isAllChecked) {
      setCheckedList(new Set());
    } else {
      setCheckedList(new Set(data.map(i => i.value)));
    }
  };
const handleConfirm = () => {
  onConfirm(checkedList);
};
  return (
    <BottomModal visible={visible} onClose={onClose}>
      <View style={{ paddingVertical: px(16), paddingLeft: px(16) }}>

        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>

          <TouchableOpacity style={styles.close} onPress={() => {
          setCheckedList(value || []);
          onClose();
          }}>
            <Image
              source={require('../../../assets/images/my/close.png')}
              style={{ width: px(16), height: px(16) }}
            />
          </TouchableOpacity>
        </View>

        {/* 全选 */}
        {/* {showCheckAll && (
          <TouchableOpacity style={styles.row} onPress={toggleAll}>
            <Text style={styles.label}>全选</Text>
            <Checkbox
              checked={isAllChecked}
              indeterminate={isIndeterminate}
            />
          </TouchableOpacity>
        )} */}

        {/* 列表 */}
        {data.map((item, index) => (
          <View key={item.value}>
            <TouchableOpacity
            activeOpacity={1}
              style={styles.row}
                onPress={() => toggleItem(item.value)}
            >
              <Text style={styles.label}>{item.label}</Text>

              <Checkbox
                checked={checkedList.includes(item.value)}
                onChange={() => toggleItem(item.value)}
              />
            </TouchableOpacity>

            {index !== data.length - 1 && <Line />}
          </View>
        ))}

        {/* 确定按钮 */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => handleConfirm()}
          >
            <LinearGradient
              colors={['#FEC525', '#FC9026']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>确定</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    </BottomModal>
  );
}

const Line = () => (
  <View
    style={{
      width: px(361),
      height: px(1),
      backgroundColor: 'rgba(118,118,118,0.2)',
    }}
  />
);

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  close: {
    position: 'absolute', right:0,
    width:px(62),height:px(35),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'flex-end',paddingRight:px(16)
  },
  title: {
  fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },
  row: {
    height: px(51),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
  },
  footer: {
    alignItems: 'center',
    marginTop: px(12),
  },
  btn: {
    width: px(240),
    height: px(38),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
        fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(20),
  },
});