import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native';

type AvatarVariant = 'plumber' | 'customer' | 'resident';

type LoopAvatarProps = {
  variant: AvatarVariant;
  size?: number;
};

type AvatarPalette = {
  ring: string;
  ringFill: string;
  hair: string;
  hairShade: string;
  skin: string;
  skinShade: string;
  shirt: string;
  shirtShade: string;
  shirtHighlight: string;
  accent: string;
  mouth: string;
};

const AVATAR_PALETTES: Record<AvatarVariant, AvatarPalette> = {
  plumber: {
    ring: '#7A4D2A',
    ringFill: '#FFF8EA',
    hair: '#5E3A24',
    hairShade: '#452716',
    skin: '#F6D2A7',
    skinShade: '#E7B786',
    shirt: '#2F77BF',
    shirtShade: '#194A7B',
    shirtHighlight: '#5E9FE0',
    accent: '#1B4F82',
    mouth: '#8E503D',
  },
  customer: {
    ring: '#7A4D2A',
    ringFill: '#FFF8EA',
    hair: '#69402B',
    hairShade: '#4D2617',
    skin: '#F3C7A7',
    skinShade: '#E5B08B',
    shirt: '#D06776',
    shirtShade: '#A9455A',
    shirtHighlight: '#E8919C',
    accent: '#E48AA0',
    mouth: '#955844',
  },
  resident: {
    ring: '#7A4D2A',
    ringFill: '#FFF8EA',
    hair: '#7A5A2F',
    hairShade: '#5B401F',
    skin: '#F4D1A4',
    skinShade: '#E4B686',
    shirt: '#ED9948',
    shirtShade: '#C86D23',
    shirtHighlight: '#F5BE77',
    accent: '#D37627',
    mouth: '#8D513D',
  },
};

export function LoopAvatar({ variant, size = 72 }: LoopAvatarProps) {
  const palette = AVATAR_PALETTES[variant];
  const floatValue = useRef(new Animated.Value(0)).current;
  const blinkValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: 1,
          duration: 1900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 1900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(1700),
        Animated.timing(blinkValue, {
          toValue: 0.14,
          duration: 90,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(blinkValue, {
          toValue: 1,
          duration: 110,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(2200),
      ]),
    );

    floatLoop.start();
    blinkLoop.start();

    return () => {
      floatLoop.stop();
      blinkLoop.stop();
    };
  }, [blinkValue, floatValue]);

  const portraitSize = Math.max(size, 58);
  const headSize = portraitSize * 0.56;
  const shoulderWidth = portraitSize * 0.78;
  const shoulderHeight = portraitSize * 0.3;
  const earSize = portraitSize * 0.12;
  const eyeSize = Math.max(4, portraitSize * 0.07);

  const floatTransform = {
    transform: [
      {
        translateY: floatValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -3, 0],
        }),
      },
      {
        rotate: floatValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ['-1deg', '1deg', '-1deg'],
        }),
      },
    ],
  };

  const blinkTransform = {
    transform: [{ scaleY: blinkValue }],
  };

  return (
    <View style={[styles.shell, { width: portraitSize, height: portraitSize }]}>
      <View style={[styles.shadow, { width: portraitSize * 0.78 }]} />

      <View
        style={[
          styles.ring,
          {
            borderColor: palette.ring,
            backgroundColor: palette.ringFill,
          },
        ]}
      >
        <Animated.View style={[styles.floatLayer, floatTransform]}>
          <View
            style={[
              styles.shoulders,
              {
                width: shoulderWidth,
                height: shoulderHeight,
                backgroundColor: palette.shirt,
                top: portraitSize * 0.68,
              },
            ]}
          >
            <View
              style={[
                styles.shoulderShade,
                { backgroundColor: palette.shirtShade },
              ]}
            />
            <View
              style={[
                styles.shoulderHighlight,
                { backgroundColor: palette.shirtHighlight },
              ]}
            />

            {variant === 'plumber' ? (
              <>
                <View style={[styles.strap, { left: '24%' }]} />
                <View style={[styles.strap, { right: '24%' }]} />
                <View style={styles.bib} />
              </>
            ) : null}
          </View>

          <View
            style={[
              styles.neck,
              {
                width: headSize * 0.16,
                height: headSize * 0.12,
                backgroundColor: palette.skinShade,
                top: portraitSize * 0.62,
              },
            ]}
          />

          <View
            style={[
              styles.ear,
              {
                width: earSize,
                height: earSize * 1.15,
                left: portraitSize * 0.22,
                top: portraitSize * 0.42,
                backgroundColor: palette.skinShade,
              },
            ]}
          />
          <View
            style={[
              styles.ear,
              {
                width: earSize,
                height: earSize * 1.15,
                right: portraitSize * 0.22,
                top: portraitSize * 0.42,
                backgroundColor: palette.skinShade,
              },
            ]}
          />

          <View
            style={[
              styles.hairBack,
              {
                width: headSize * 0.98,
                height: headSize * 0.68,
                top: portraitSize * 0.19,
                backgroundColor: palette.hair,
              },
            ]}
          />

          {variant === 'plumber' ? (
            <>
              <View
                style={[
                  styles.capTop,
                  {
                    width: headSize * 0.9,
                    height: headSize * 0.22,
                    top: portraitSize * 0.14,
                    backgroundColor: palette.shirt,
                  },
                ]}
              />
              <View
                style={[
                  styles.capBrim,
                  {
                    width: headSize * 1.08,
                    height: headSize * 0.1,
                    top: portraitSize * 0.24,
                    backgroundColor: palette.accent,
                  },
                ]}
              />
            </>
          ) : null}

          {variant === 'customer' ? (
            <View
              style={[
                styles.headband,
                {
                  width: headSize * 0.82,
                  top: portraitSize * 0.18,
                  backgroundColor: palette.accent,
                },
              ]}
            />
          ) : null}

          <View
            style={[
              styles.head,
              {
                width: headSize,
                height: headSize,
                backgroundColor: palette.skin,
                top: portraitSize * 0.24,
              },
            ]}
          >
            <View
              style={[
                styles.faceShade,
                { backgroundColor: palette.skinShade },
              ]}
            />

            <View
              style={[
                styles.frontHair,
                {
                  width: headSize * 0.9,
                  height: headSize * 0.24,
                  backgroundColor: palette.hair,
                },
              ]}
            >
              <View
                style={[
                  styles.hairShine,
                  {
                    backgroundColor: palette.hairShade,
                  },
                ]}
              />
            </View>

            <View style={styles.eyeRow}>
              <Animated.View
                style={[
                  styles.eye,
                  blinkTransform,
                  { width: eyeSize, height: eyeSize },
                ]}
              />
              <Animated.View
                style={[
                  styles.eye,
                  blinkTransform,
                  { width: eyeSize, height: eyeSize },
                ]}
              />
            </View>

            <View style={styles.nose} />
            <View style={styles.cheekLeft} />
            <View style={styles.cheekRight} />
            <View style={[styles.mouth, { backgroundColor: palette.mouth }]} />
            <View style={styles.chinShade} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: 2,
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(92, 56, 27, 0.18)',
  },
  ring: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 3,
    overflow: 'hidden',
  },
  floatLayer: {
    flex: 1,
    alignItems: 'center',
  },
  shoulders: {
    position: 'absolute',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    overflow: 'hidden',
  },
  shoulderShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  shoulderHighlight: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    top: '10%',
    height: '18%',
    borderRadius: 999,
  },
  strap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#173F69',
  },
  bib: {
    position: 'absolute',
    left: '33%',
    right: '33%',
    top: '16%',
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#245C96',
  },
  neck: {
    position: 'absolute',
    borderRadius: 999,
  },
  ear: {
    position: 'absolute',
    borderRadius: 999,
  },
  hairBack: {
    position: 'absolute',
    borderRadius: 999,
  },
  capTop: {
    position: 'absolute',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },
  capBrim: {
    position: 'absolute',
    borderRadius: 999,
  },
  headband: {
    position: 'absolute',
    height: 7,
    borderRadius: 999,
  },
  head: {
    position: 'absolute',
    borderRadius: 999,
    alignItems: 'center',
    overflow: 'hidden',
  },
  faceShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '44%',
    opacity: 0.18,
  },
  frontHair: {
    position: 'absolute',
    top: 3,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
  },
  hairShine: {
    position: 'absolute',
    left: '14%',
    right: '14%',
    top: 2,
    height: 5,
    borderRadius: 999,
    opacity: 0.24,
  },
  eyeRow: {
    marginTop: '46%',
    width: '34%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eye: {
    borderRadius: 999,
    backgroundColor: '#4E3523',
  },
  nose: {
    marginTop: 8,
    width: 6,
    height: 9,
    borderRadius: 3,
    backgroundColor: 'rgba(215, 170, 132, 0.7)',
  },
  cheekLeft: {
    position: 'absolute',
    left: '14%',
    bottom: '24%',
    width: 12,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(236, 153, 126, 0.36)',
  },
  cheekRight: {
    position: 'absolute',
    right: '14%',
    bottom: '24%',
    width: 12,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(236, 153, 126, 0.36)',
  },
  mouth: {
    position: 'absolute',
    bottom: '18%',
    width: 14,
    height: 4,
    borderRadius: 999,
  },
  chinShade: {
    position: 'absolute',
    bottom: '8%',
    width: '30%',
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(175, 126, 88, 0.16)',
  },
});
