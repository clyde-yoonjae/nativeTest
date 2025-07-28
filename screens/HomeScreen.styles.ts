import { StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.small,
  },
  navButtonText: {
    fontSize: 24,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weight.bold,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  greetingText: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    ...theme.shadow.medium,
    minHeight: 120,
  },
  cardTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    fontSize: theme.typography.size.xxl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl * 2,
  },
  emptyTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  addButton: {
    marginBottom: theme.spacing.xl,
  },
});

export default styles;
