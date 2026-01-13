<script setup lang="ts">
const { success, error: showError } = useToast()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '',
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const submitTime = ref(Date.now())

const validateForm = (): boolean => {
  errors.value = {}

  if (form.website) return false

  if (Date.now() - submitTime.value < 3000) {
    errors.value.general = 'Te rugăm să aștepți câteva secunde înainte de a trimite.'
    return false
  }

  if (!form.name.trim()) {
    errors.value.name = 'Numele este obligatoriu'
  } else if (form.name.length < 2 || form.name.length > 100) {
    errors.value.name = 'Numele trebuie să aibă între 2 și 100 de caractere'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.value.email = 'Email-ul este obligatoriu'
  } else if (!emailRegex.test(form.email)) {
    errors.value.email = 'Adresa de email nu este validă'
  }

  if (form.subject && form.subject.length > 200) {
    errors.value.subject = 'Subiectul trebuie să aibă mai puțin de 200 de caractere'
  }

  if (!form.message.trim()) {
    errors.value.message = 'Mesajul este obligatoriu'
  } else if (form.message.length < 10) {
    errors.value.message = 'Mesajul trebuie să aibă cel puțin 10 caractere'
  } else if (form.message.length > 5000) {
    errors.value.message = 'Mesajul trebuie să aibă mai puțin de 5000 de caractere'
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (form.website) {
    success('Mulțumim pentru mesaj! Îți vom răspunde în curând.')
    return
  }

  if (!validateForm()) {
    if (!form.website) showError('Te rugăm să corectezi erorile din formular')
    return
  }

  isSubmitting.value = true

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { name: form.name, email: form.email, subject: form.subject, message: form.message },
    })

    success('Mulțumim pentru mesaj! Îți vom răspunde în curând.')
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    form.website = ''
    errors.value = {}
    submitTime.value = Date.now()
  } catch (err: any) {
    showError(err.data?.message || 'Mesajul nu a putut fi trimis. Te rugăm să încerci din nou.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => { submitTime.value = Date.now() })
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div class="hidden" aria-hidden="true">
      <label for="website">Website</label>
      <input id="website" v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" />
    </div>

    <div>
      <label for="name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nume *</label>
      <input
        id="name" v-model="form.name" type="text" required
        class="w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200"
        :class="errors.name ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email *</label>
      <input
        id="email" v-model="form.email" type="email" required
        class="w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200"
        :class="errors.email ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'"
      />
      <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
    </div>

    <div>
      <label for="subject" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Subiect</label>
      <input
        id="subject" v-model="form.subject" type="text"
        class="w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200"
        :class="errors.subject ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'"
      />
      <p v-if="errors.subject" class="mt-1 text-sm text-red-500">{{ errors.subject }}</p>
    </div>

    <div>
      <label for="message" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Mesaj *</label>
      <textarea
        id="message" v-model="form.message" required rows="6"
        class="w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 resize-y"
        :class="errors.message ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'"
      />
      <p v-if="errors.message" class="mt-1 text-sm text-red-500">{{ errors.message }}</p>
    </div>

    <p v-if="errors.general" class="text-sm text-red-500">{{ errors.general }}</p>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="group relative w-full px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-zinc-900/25 dark:hover:shadow-white/25 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
    >
      <span :class="isSubmitting ? 'opacity-0' : 'opacity-100'" class="transition-opacity">
        Trimite Mesaj
      </span>
      <span 
        v-if="isSubmitting" 
        class="absolute inset-0 flex items-center justify-center"
      >
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </span>
    </button>
  </form>
</template>
