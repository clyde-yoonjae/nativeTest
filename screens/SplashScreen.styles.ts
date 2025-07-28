import { StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  appName: {
    fontSize: theme.typography.size.title,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xxxl * 2,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxl,
  },
});

export default styles;
