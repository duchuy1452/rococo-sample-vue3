<template>
  <q-item class="q-py-md" :class="{ 'todo-completed': todo.completed }">
    <q-item-section avatar>
      <q-checkbox :model-value="todo.completed" @update:model-value="$emit('toggle')" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="{ 'text-strike': todo.completed }">
        {{ todo.title }}
      </q-item-label>
      <q-item-label caption>
        <q-chip :color="getPriorityColor(todo.priority)" text-color="white" size="sm">
          {{ todo.priority }}
        </q-chip>
        <template v-if="todo.dueDate">
          <q-chip
            :color="isOverdue(todo.dueDate) ? 'negative' : 'grey'"
            text-color="white"
            size="sm"
          >
            Due {{ formatDate(todo.dueDate) }}
          </q-chip>
        </template>
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="row items-center">
        <q-btn flat round color="primary" icon="edit" size="sm" @click="$emit('edit')" />
        <q-btn flat round color="negative" icon="delete" size="sm" @click="$emit('delete')" />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { date } from 'quasar'

defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle', 'edit', 'delete'])

const getPriorityColor = (priority) => {
  const colors = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  }
  return colors[priority] || 'grey'
}

const formatDate = (dateStr) => {
  return date.formatDate(dateStr, 'MMM D')
}

const isOverdue = (dateStr) => {
  return date.getDateDiff(new Date(), dateStr, 'days') > 0
}
</script>

<style scoped>
.todo-completed {
  opacity: 0.7;
  background: #f9f9f9;
}

.text-strike {
  text-decoration: line-through;
  color: #9e9e9e;
}
</style>
