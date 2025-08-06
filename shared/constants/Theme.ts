// styles/theme.ts
import { colors } from "./Colors";

const theme = {
  colors: colors.dark, // dark 모드를 기본 색상으로 사용
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  borderRadius: 8,
  shadow: {
    color: '#000',
    offset: { width: 0, height: 2 },
    opacity: 0.2,
    radius: 3,
  },
};

export default theme;
