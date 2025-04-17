<template>
  <div class="row items-center q-mb-md">
    <div class="col-12 col-sm-8">
      <q-btn-group flat>
        <q-btn
          v-for="option in filterOptions"
          :key="option.value"
          :color="currentFilter === option.value ? 'primary' : 'grey'"
          :label="option.label"
          @click="$emit('filter-change', option.value)"
          flat
        />
      </q-btn-group>
    </div>
    <div class="col-12 col-sm-4 text-right">
      <q-btn
        v-if="completedCount > 0"
        label="Clear Completed"
        color="negative"
        flat
        dense
        @click="$emit('clear-completed')"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentFilter: {
    type: String,
    required: true,
  },
  completedCount: {
    type: Number,
    required: true,
  },
})

defineEmits(['filter-change', 'clear-completed'])

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'incomplete' },
  { label: 'Completed', value: 'completed' },
]
</script>
