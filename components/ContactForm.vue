<script setup lang="ts">
const { success, error: showError } = useToast()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Name is required'
  } else if (form.name.length < 2 || form.name.length > 100) {
    errors.value.name = 'Name must be between 2 and 100 characters'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!emailRegex.test(form.email)) {
    errors.value.email = 'Invalid email address'
  }

  if (form.subject && form.subject.length > 200) {
    errors.value.subject = 'Subject must be less than 200 characters'
  }

  if (!form.message.trim()) {
    errors.value.message = 'Message is required'
  } else if (form.message.length < 10) {
    errors.value.message = 'Message must be at least 10 characters'
  } else if (form.message.length > 5000) {
    errors.value.message = 'Message must be less than 5000 characters'
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    showError('Please fix the errors in the form')
    return
  }

  isSubmitting.value = true

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: form,
    })

    success('Thank you for your message! We\'ll get back to you soon.')

    // Reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    errors.value = {}
  } catch (err: any) {
    showError(err.data?.message || 'Failed to send message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <!-- Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        Name *
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
        Subject
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
        Message *
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

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="!isSubmitting">Send Message</span>
      <span v-else>Sending...</span>
    </button>
  </form>
</template>
