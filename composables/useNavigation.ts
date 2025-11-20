import { NAV_LINKS } from '~/constants'

/**
 * Navigation composable
 * Provides navigation links with active state detection
 */
export const useNavigation = () => {
  const route = useRoute()

  const links = computed(() => NAV_LINKS.map(link => ({
    ...link,
    isActive: route.path === link.to ||
              (link.to !== '/' && route.path.startsWith(link.to))
  })))

  return { links }
}
