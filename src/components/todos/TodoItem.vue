<template>
  <q-item v-ripple clickable class="todo-item q-py-md">
    <q-item-section avatar>
      <q-checkbox :model-value="todo.completed" @update:model-value="$emit('toggle')" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="{ 'text-strike': todo.completed }" class="text-subtitle1 q-mb-xs">
        {{ todo.title }}
      </q-item-label>
      <q-item-label caption class="text-grey-8 q-mb-sm">
        {{ todo.description || '(No description)' }}
      </q-item-label>
      <q-item-label caption class="row items-center text-grey-7">
        <q-icon name="event" size="16px" class="q-mr-xs" />
        {{ formatDate(todo.dueDate) }}
        <q-separator vertical spaced />
        <q-icon name="flag" size="16px" class="q-mr-xs" />
        {{ getPriorityLabel(todo.priority) }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="row items-center">
        <q-btn flat round color="primary" icon="edit" size="sm" @click.stop="$emit('edit')" />
        <q-btn flat round color="negative" icon="delete" size="sm" @click.stop="$emit('delete')" />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import dayjs from 'dayjs'
import { PRIORITY_LABELS } from '@/constants/priority'

defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle', 'edit', 'delete'])

const formatDate = (date) => {
  if (!date) return 'No due date'
  return dayjs(date).format('YYYY/MM/DD')
}

const getPriorityLabel = (priority) => {
  return PRIORITY_LABELS[priority] || 'Unknown'
}
</script>

<style lang="scss" scoped>
.todo-item {
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  .text-strike {
    text-decoration: line-through;
    color: #9e9e9e;
  }
}
</style>
