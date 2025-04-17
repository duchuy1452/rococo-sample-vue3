<template>
  <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
    <!-- Title field -->
    <q-input
      v-model="formData.title"
      label="Title *"
      :rules="[(val) => !!val || 'Title is required']"
      filled
      clearable
      class="q-mb-md"
      hint="Enter task title"
      :error="!formData.title && submitted"
      :error-message="!formData.title && submitted ? 'Title is required' : ''"
    >
      <template v-slot:prepend>
        <q-icon name="title" />
      </template>
    </q-input>

    <!-- Description field -->
    <q-input
      v-model="formData.description"
      label="Description"
      type="textarea"
      filled
      clearable
      autogrow
      class="q-mb-md"
      hint="Enter task description"
      rows="3"
    >
      <template v-slot:prepend>
        <q-icon name="description" />
      </template>
    </q-input>

    <!-- Due date field -->
    <q-input
      v-model="formData.dueDate"
      label="Due Date"
      filled
      class="q-mb-md"
      hint="Select due date"
    >
      <template v-slot:prepend>
        <q-icon name="event" />
      </template>
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="formData.dueDate">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- Priority field -->
    <q-select
      v-model="formData.priority"
      :options="PRIORITY_OPTIONS"
      label="Priority"
      filled
      emit-value
      map-options
    >
      <template v-slot:prepend>
        <q-icon name="flag" />
      </template>
    </q-select>

    <!-- Form actions -->
    <div class="row justify-end q-gutter-sm">
      <q-btn label="Cancel" color="grey" flat @click="$emit('cancel')" />
      <q-btn :label="submitLabel" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { PRIORITY_OPTIONS, DEFAULT_PRIORITY } from '@/constants/priority'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      dueDate: null,
      priority: DEFAULT_PRIORITY,
    }),
  },
  submitLabel: {
    type: String,
    default: 'Submit',
  },
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  title: '',
  description: '',
  dueDate: null,
  priority: DEFAULT_PRIORITY,
})

const submitted = ref(false)

// Watch for changes in initialData and update formData
watch(
  () => props.initialData,
  (newVal) => {
    formData.value = { ...newVal }
  },
  { deep: true },
)

onMounted(() => {
  formData.value = { ...props.initialData }
})

const handleSubmit = () => {
  submitted.value = true

  if (!formData.value.title) {
    return
  }

  emit('submit', {
    title: formData.value.title,
    description: formData.value.description || '',
    dueDate: formData.value.dueDate,
    priority: formData.value.priority,
  })

  // Reset form after submission
  submitted.value = false
}
</script>

<style lang="scss" scoped>
.q-form {
  max-width: 100%;

  :deep(.q-field) {
    margin-bottom: 1rem;
  }
}
</style>
