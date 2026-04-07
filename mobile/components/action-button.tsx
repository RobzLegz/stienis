import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

type ActionButtonProps = PropsWithChildren<
  PressableProps & {
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
  }
>;

export function ActionButton({ buttonStyle, children, disabled, style, textStyle, ...props }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(pressableState) => [
        styles.button,
        buttonStyle,
        disabled && styles.disabled,
        pressableState.pressed && !disabled && styles.pressed,
        typeof style === 'function' ? style(pressableState) : style,
      ]}
      {...props}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 18,
  },
  text: {
    fontSize: 18,
    fontWeight: '900',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.72,
  },
});
