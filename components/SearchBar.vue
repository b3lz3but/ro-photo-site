<script setup lang="ts">
const { query, results, isSearching, search, clear } = useSearch()
const isOpen = ref(false)
const searchInput = ref<HTMLInputElement>()

const handleSearch = (value: string) => {
  if (value.trim()) {
    search(value)
    isOpen.value = true
  } else {
    clear()
    isOpen.value = false
  }
}

const selectResult = (path: string) => {
  navigateTo(path)
  clear()
  isOpen.value = false
}

// Close on escape
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    clear()
    isOpen.value = false
  }
}

// Close when clicking outside
onClickOutside(searchInput, () => {
  isOpen.value = false
})
</script>

<template>
  <div class="relative">
    <div class="relative">
      <Icon
        name="heroicons:magnifying-glass-20-solid"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
      />
      <input
        ref="searchInput"
        v-model="query"
        type="search"
        placeholder="Search galleries and stories..."
        class="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-200 focus:outline-none bg-white dark:bg-zinc-800"
        @input="handleSearch(query)"
        @keydown="handleKeydown"
        @focus="isOpen = results.length > 0"
      />
      <button
        v-if="query"
        @click="clear(); isOpen = false"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        aria-label="Clear search"
      >
        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
      </button>
    </div>

    <!-- Search Results -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen && (isSearching || results.length > 0)"
        class="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 max-h-96 overflow-y-auto"
      >
        <!-- Loading state -->
        <div v-if="isSearching" class="p-4 text-center text-zinc-500">
          <Icon name="svg-spinners:ring-resize" class="w-6 h-6 inline-block" />
          <span class="ml-2">Searching...</span>
        </div>

        <!-- Results -->
        <ul v-else-if="results.length > 0" class="py-2">
          <li
            v-for="result in results"
            :key="result._path"
            class="hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <button
              @click="selectResult(result._path)"
              class="w-full text-left px-4 py-3 focus:outline-none focus:bg-zinc-100 dark:focus:bg-zinc-700"
            >
              <div class="flex items-start gap-3">
                <NuxtImg
                  v-if="result.cover?.src"
                  :src="result.cover.src"
                  :alt="result.cover.alt || result.title"
                  class="w-16 h-16 object-cover rounded"
                  width="64"
                  height="64"
                />
                <div class="flex-1">
                  <p class="font-medium text-zinc-900 dark:text-zinc-100">
                    {{ result.title }}
                  </p>
                  <p v-if="result.description" class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {{ result.description }}
                  </p>
                </div>
              </div>
            </button>
          </li>
        </ul>

        <!-- No results -->
        <div v-else class="p-4 text-center text-zinc-500">
          No results found for "{{ query }}"
        </div>
      </div>
    </Transition>
  </div>
</template>
