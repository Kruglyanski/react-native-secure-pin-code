import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    color: '#82B5D8',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#959595',
    marginBottom: 20,
  },

  remaining: {
    marginBottom: 10,
    fontSize: 30,
    color: '#959595',
  },

  lock: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#959595',
  },

  red: {
    color: '#ec4a47ff',
  },

  forgetPin: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
    color: '#0071b9',
  },

  dotsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },

  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#82B5D8',
    margin: 8,
  },

  dotFilled: {
    backgroundColor: '#82B5D8',
  },

  dotError: {
    backgroundColor: '#e22826',
    borderColor: '#e22826',
  },

  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    height: 360,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },

  key: {
    width: 66,
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 33,
    backgroundColor: '#E3E6ED',
  },

  keyText: {
    fontSize: 30,
    color: '#959595',
  },

  pop: {
    position: 'absolute',
    width: 66,
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 36,
    right: 0,
  },

  disabled: {
    opacity: 0.4,
  },
});