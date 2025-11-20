import type { Gallery, Story } from '~/types/image'

/**
 * Search composable
 * Provides search functionality across galleries and stories
 */
export const useSearch = () => {
  const query = ref('')
  const results = ref<Array<Gallery | Story>>([])
  const isSearching = ref(false)

  const search = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      results.value = []
      return
    }

    isSearching.value = true
    query.value = searchTerm

    try {
      const lowerQuery = searchTerm.toLowerCase()

      // Search galleries
      const galleries = await queryContent<Gallery>('galleries')
        .where({
          $or: [
            { title: { $regex: new RegExp(lowerQuery, 'i') } },
            { description: { $regex: new RegExp(lowerQuery, 'i') } },
            { tags: { $contains: lowerQuery } },
          ],
        })
        .limit(10)
        .find()

      // Search stories
      const stories = await queryContent<Story>('stories')
        .where({
          $or: [
            { title: { $regex: new RegExp(lowerQuery, 'i') } },
            { description: { $regex: new RegExp(lowerQuery, 'i') } },
            { tags: { $contains: lowerQuery } },
          ],
        })
        .limit(10)
        .find()

      results.value = [...galleries, ...stories]
    } catch (error) {
      console.error('Search error:', error)
      results.value = []
    } finally {
      isSearching.value = false
    }
  }

  const clear = () => {
    query.value = ''
    results.value = []
  }

  // Debounced search
  const debouncedSearch = useDebounceFn(search, 300)

  return {
    query,
    results: readonly(results),
    isSearching: readonly(isSearching),
    search: debouncedSearch,
    clear,
  }
}
