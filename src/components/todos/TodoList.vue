<template>
  <div class="todo-container q-pa-md">
    <div class="row justify-center q-mb-lg">
      <div class="col-12 col-md-8">
        <q-card class="todo-card">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h5 text-weight-bold text-primary">My Tasks</div>
              <q-btn color="primary" icon="add" label="Add Task" @click="showAddDialog = true" />
            </div>

            <!-- Filters -->
            <TodoFilters
              :current-filter="filter"
              :completed-count="completedTodos"
              @filter-change="setFilter"
              @clear-completed="clearCompleted"
            />

            <!-- Todo List -->
            <q-list separator>
              <TodoItem
                v-for="todo in filteredTodos"
                :key="todo.id"
                :todo="todo"
                @toggle="toggleTodo(todo.id)"
                @edit="startEditing(todo)"
                @delete="deleteTodo(todo.id)"
              />
            </q-list>

            <!-- Stats -->
            <div class="row justify-between q-mt-md text-grey-7">
              <div>{{ activeTodos }} items left</div>
              <div>Total: {{ totalTodos }} | Completed: {{ completedTodos }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Add Task Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card style="width: 600px; max-width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add New Task</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <TodoForm
            :initial-data="{
              title: '',
              description: '',
              priority: 1,
              dueDate: null,
            }"
            submit-label="Add Task"
            @submit="handleAddSubmit"
            @cancel="showAddDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Task Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card style="width: 600px; max-width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Edit Task</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <TodoForm
            v-if="showEditDialog"
            :initial-data="editingTask"
            submit-label="Save Changes"
            @submit="handleEditSubmit"
            @cancel="showEditDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from 'src/stores/todo'
import TodoItem from './TodoItem.vue'
import TodoFilters from './TodoFilters.vue'
import TodoForm from './TodoForm.vue'

const store = useTodoStore()
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editingId = ref(null)
const editingTask = ref({
  title: '',
  description: '',
  priority: 1,
  dueDate: null,
})

// Load todos on mount
onMounted(() => {
  store.loadTodos()
})

// Computed properties
const filteredTodos = computed(() => store.filteredTodos)
const filter = computed(() => store.filter)
const totalTodos = computed(() => store.totalTodos)
const activeTodos = computed(() => store.activeTodos)
const completedTodos = computed(() => store.completedTodos)

// Methods
const handleAddSubmit = (formData) => {
  store.addTodo(formData)
  showAddDialog.value = false
}

const handleEditSubmit = (formData) => {
  store.updateTodo(editingId.value, formData)
  showEditDialog.value = false
  editingId.value = null
}

const startEditing = (todo) => {
  editingId.value = todo.id
  editingTask.value = {
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate,
  }
  showEditDialog.value = true
}

const deleteTodo = (id) => {
  store.deleteTodo(id)
}

const toggleTodo = (id) => {
  store.toggleTodo(id)
}

const setFilter = (newFilter) => {
  store.setFilter(newFilter)
}

const clearCompleted = () => {
  store.clearCompleted()
}
</script>

<style lang="scss" scoped>
.todo-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.todo-card {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
