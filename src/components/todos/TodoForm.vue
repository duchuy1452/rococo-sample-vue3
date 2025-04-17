<template>
  <q-form ref="form" @submit.prevent="onSubmit">
    <div class="q-gutter-md">
      <q-input
        v-model.trim="formData.title"
        label="Task Title"
        :rules="[(val) => !!val || 'Task title is required']"
        outlined
        autofocus
      />

      <q-select
        v-model="formData.priority"
        :options="priorityOptions"
        label="Priority"
        outlined
        emit-value
        map-options
        options-dense
      />

      <q-input v-model="formData.dueDate" label="Due Date" outlined>
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="dateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date
                v-model="formData.dueDate"
                mask="YYYY-MM-DD"
                @update:model-value="$refs.dateProxy.hide()"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <div class="row justify-end q-gutter-sm">
        <q-btn label="Cancel" color="grey" @click="$emit('cancel')" />
        <q-btn :label="submitLabel" type="submit" color="primary" />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      title: '',
      priority: 'medium',
      dueDate: null,
    }),
  },
  submitLabel: {
    type: String,
    default: 'Add Task',
  },
})

const emit = defineEmits(['submit', 'cancel'])
const form = ref(null)
const dateProxy = ref(null)

const formData = reactive({
  title: props.initialData.title,
  priority: props.initialData.priority,
  dueDate: props.initialData.dueDate,
})

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

const onSubmit = async () => {
  const isValid = await form.value.validate()
  if (isValid) {
    emit('submit', { ...formData })
  }
}

// Reset form when initialData changes
onMounted(() => {
  Object.assign(formData, props.initialData)
})
</script>
