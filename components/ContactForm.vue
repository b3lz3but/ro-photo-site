<script setup lang="ts">
const { success, error: showError } = useToast()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '', // Honeypot field - should remain empty
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const submitTime = ref(Date.now())

const validateForm = (): boolean => {
  errors.value = {}

  // Honeypot check - if filled, it's a bot
  if (form.website) {
    // Silently reject but pretend success to confuse bots
    return false
  }

  // Time-based check - if submitted too fast (< 3 seconds), likely a bot
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
  // Honeypot check - silently succeed for bots
  if (form.website) {
    success('Mulțumim pentru mesaj! Îți vom răspunde în curând.')
    return
  }

  if (!validateForm()) {
    if (!form.website) {
      showError('Te rugăm să corectezi erorile din formular')
    }
    return
  }

  isSubmitting.value = true

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      },
    })

    success('Mulțumim pentru mesaj! Îți vom răspunde în curând.')

    // Reset form
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

// Reset submit time when component mounts
onMounted(() => {
  submitTime.value = Date.now()
})
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <!-- Honeypot field - hidden from users, visible to bots -->
    <div class="hidden" aria-hidden="true">
      <label for="website">Website</label>
      <input
        id="website"
        v-model="form.website"
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <!-- Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        Nume *
      </label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        :class="[
          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-colors',
          errors.name
            ? 'border-red-500 focus:ring-red-500'
            : 'border-zinc-300 dark:border-zinc-700 focus:ring-zinc-800 dark:focus:ring-zinc-200'
        ]"
        :aria-invalid="!!errors.name"
        :aria-describedby="errors.name ? 'name-error' : undefined"
      />
      <p v-if="errors.name" id="name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ errors.name }}
      </p>
    </div>

    <!-- Email -->
    <div>
      <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        Email *
      </label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        :class="[
          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-colors',
          errors.email
            ? 'border-red-500 focus:ring-red-500'
            : 'border-zinc-300 dark:border-zinc-700 focus:ring-zinc-800 dark:focus:ring-zinc-200'
        ]"
        :aria-invalid="!!errors.email"
        :aria-describedby="errors.email ? 'email-error' : undefined"
      />
      <p v-if="errors.email" id="email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ errors.email }}
      </p>
    </div>

    <!-- Subject -->
    <div>
      <label for="subject" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        Subiect
      </label>
      <input
        id="subject"
        v-model="form.subject"
        type="text"
        :class="[
          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-colors',
          errors.subject
            ? 'border-red-500 focus:ring-red-500'
            : 'border-zinc-300 dark:border-zinc-700 focus:ring-zinc-800 dark:focus:ring-zinc-200'
        ]"
        :aria-invalid="!!errors.subject"
        :aria-describedby="errors.subject ? 'subject-error' : undefined"
      />
      <p v-if="errors.subject" id="subject-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ errors.subject }}
      </p>
    </div>

    <!-- Message -->
    <div>
      <label for="message" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        Mesaj *
      </label>
      <textarea
        id="message"
        v-model="form.message"
        required
        rows="6"
        :class="[
          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-colors resize-y',
          errors.message
            ? 'border-red-500 focus:ring-red-500'
            : 'border-zinc-300 dark:border-zinc-700 focus:ring-zinc-800 dark:focus:ring-zinc-200'
        ]"
        :aria-invalid="!!errors.message"
        :aria-describedby="errors.message ? 'message-error' : undefined"
      />
      <p v-if="errors.message" id="message-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ errors.message }}
      </p>
    </div>

    <!-- General error -->
    <p v-if="errors.general" class="text-sm text-red-600 dark:text-red-400">
      {{ errors.general }}
    </p>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="!isSubmitting">Trimite Mesaj</span>
      <span v-else>Se trimite...</span>
    </button>
  </form>
</template>
