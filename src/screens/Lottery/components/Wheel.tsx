import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Image as RNImage
} from 'react-native';

import Svg, {
  G,
  Path,
  Line,
  Text as SvgText,
   Image as SvgImage,
   TSpan,
} from 'react-native-svg';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { px } from '../../../utils/scaleUtils';

const AnimatedView =
  Animated.createAnimatedComponent(View);
    const prizeIcons = {
    COIN: require('../../../../assets/images/lottery/biicon.png'),
  
    SERVICE: require('../../../../assets/images/lottery/sericon.png'),
  
    COUPON: require('../../../../assets/images/lottery/coinicon.png'),

    NONE : require('../../../../assets/images/lottery/sericon.png'),
  };
export default function LotteryWheel({

  // 父组件传入奖品列表
  data = [],

  // 父组件控制开始抽奖
  onStart,

  // 父组件控制是否抽奖中
  spinning = false,

  // 父组件指定中奖位置
  targetIndex = 0,

}) {

  // 转盘尺寸
  const size = px(255);

  // 半径
  const radius = size / 2;

  // 圆心
  const center = radius;

  // 奖品数量
  const count = data.length;

  // 每个奖品角度
  const perAngle = 360 / count;

  // 当前旋转角度
  const rotate = useSharedValue(0);

  // SVG角度
  const angle = (2 * Math.PI) / count;

  // 监听 targetIndex 变化自动旋转
  React.useEffect(() => {

    // 父组件未开始抽奖
    if (!spinning) return;

    // 当前角度
    const currentRotate =
      rotate.value % 360;

    // 目标角度
    const targetAngle =
      360 -
      targetIndex * perAngle -
      perAngle / 2;

    // 最终角度
    const finalRotate =
      rotate.value +
      360 * 6 +
      (
        targetAngle -
        currentRotate
      );

    rotate.value = withTiming(
      finalRotate,
      {
        duration: 5000,
        easing: Easing.out(Easing.cubic),
      },
    );

  }, [targetIndex, spinning]);

  // 动画样式
  const animatedStyle =
    useAnimatedStyle(() => {

      return {
        transform: [
          {
            rotate: `${rotate.value}deg`,
          },
        ],
      };

    });

  // 画扇形
  const describeArc = (
    x,
    y,
    r,
    startAngle,
    endAngle,
  ) => {

    const x1 =
      x + r * Math.cos(startAngle);

    const y1 =
      y + r * Math.sin(startAngle);

    const x2 =
      x + r * Math.cos(endAngle);

    const y2 =
      y + r * Math.sin(endAngle);

    const largeArcFlag =
      endAngle - startAngle <= Math.PI
        ? 0
        : 1;

    return `
      M ${x} ${y}
      L ${x1} ${y1}
      A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;
  };
const splitText = (
  text,
  firstLength = 7,
  secondLength = 4,
) => {

  if (!text) return [];

  // 第一行
  const first =
    text.slice(0, firstLength);

  // 第二行
  let second =
    text.slice(
      firstLength,
      firstLength + secondLength,
    );

  // 超出显示...
  if (
    text.length >
    firstLength + secondLength
  ) {
    second += '...';
  }

  return [first, second].filter(Boolean);
};
  return (
    <View style={styles.container}>

      {/* 转盘 */}
      <AnimatedView style={animatedStyle}>

        <Svg width={size} height={size}>
          <G>

            {data.map((item, i) => {
const icon =
  Image.resolveAssetSource(
    prizeIcons[item.prizeType]
  );
              // 起始角度
              const start =
                i * angle -
                Math.PI / 2;

              // 结束角度
              const end =
                (i + 1) * angle -
                Math.PI / 2;

              // 中间角度
              const midAngle =
                (start + end) / 2;

              // 小文字位置
              const x =
                center +
                radius *
                  0.84 *
                  Math.cos(midAngle);

              const y =
                center +
                radius *
                 0.84 *
                  Math.sin(midAngle);

// 图片距离文字的距离
const lines =
  item.prizeName.length > 7
    ? 2
    : 1;

const lineHeight = px(15);

const textHeight =
  lines === 2
    ? lineHeight
    : 0;

// 图片与文字距离
const imageGap = px(26);

const ix =
  x -
  (textHeight + imageGap) *
    Math.cos(midAngle);

const iy =
  y -
  (textHeight + imageGap) *
    Math.sin(midAngle);
              return (
                <G key={i}>

                  {/* 扇形 */}
                  <Path
                    d={describeArc(
                      center,
                      center,
                      radius,
                      start,
                      end,
                    )}
                    fill={
                      i % 2 === 0
                        ? '#FCEEDF'
                        : '#FFFFFF'
                    }
                  />

                  {/* 虚线 */}
                  <Line
                    x1={center}
                    y1={center}
                    x2={
                      center +
                      radius *
                        Math.cos(start)
                    }
                    y2={
                      center +
                      radius *
                        Math.sin(start)
                    }
                    stroke="#F9821A"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />

                  {/* 文字 */}
{/* 文字 */}
<SvgText
  x={x}
  y={y}
  fill="#5C4129"
  fontSize={px(12)}
  fontWeight="bold"
  textAnchor="middle"
  fontFamily="MiSans-Bold"
  alignmentBaseline="middle"
  rotation={
    (midAngle * 180) / Math.PI + 90
  }
  origin={`${x}, ${y}`}
>
  {/* 第一行 */}
  <TSpan
    x={x}
    dy={0}
  >
    {item.prizeName.slice(0, 7)}
  </TSpan>

  {/* 第二行 */}
  {item.prizeName.length > 7 && (
    <TSpan
      x={x}
      dy={px(15)} // ← 行间距加大
    >
      {
        item.prizeName.length > 10
          ? item.prizeName.slice(7, 10) + '...'
          : item.prizeName.slice(7)
      }
    </TSpan>
  )}
</SvgText>

{/* 图标 */}
<SvgImage
  x={ix - px(16)}
  y={iy - px(16)}
  width={px(32)}
  height={px(32)}
  href={icon.uri}
  preserveAspectRatio="xMidYMid slice"
  transform={`rotate(${
    (midAngle * 180) / Math.PI + 90
  } ${ix} ${iy})`}
/>

                </G>
              );
            })}

          </G>
        </Svg>

      </AnimatedView>

      {/* 中间按钮 */}
      <View
        style={styles.button}
      >

        <Image
          source={require('../../../../assets/images/lottery/pointer.png')}
          style={{
            width: px(82),
            height: px(108),
          }}
        />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
  },

  button: {
    marginTop: px(60),

    position: 'absolute',

    width: px(82),
    height: px(108),

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 999,
  },

});