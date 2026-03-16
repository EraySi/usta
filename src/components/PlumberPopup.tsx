import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { LoopAvatar } from './LoopAvatar';

type PlumberPopupProps = {
  message: string;
  popupKey: string;
  title: string;
};

export function PlumberPopup({ message, popupKey, title }: PlumberPopupProps) {
  const translateY = useRef(new Animated.Value(56)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    translateY.setValue(56);
    opacity.setValue(0);

    const animation = Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2400),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 56,
          duration: 360,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 260,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity, popupKey, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.avatarWrap}>
        <LoopAvatar size={86} variant="plumber" />
      </View>

      <View style={styles.bubble}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 182,
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  avatarWrap: {
    width: 98,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#FFF8EA',
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: '#7C4E25',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    color: '#243E67',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  message: {
    color: '#6A5943',
    fontSize: 14,
    lineHeight: 20,
  },
});
