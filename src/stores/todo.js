import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { todoApi } from 'src/services/todoService'

export const useTodoStore = defineStore('todo', () => {
  const $q = useQuasar()
  const todos = ref([])
  const filter = ref('all')
  const loading = ref(false)

  // Computed properties
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter((todo) => !todo.completed)
      case 'completed':
        return todos.value.filter((todo) => todo.completed)
      default:
        return todos.value
    }
  })

  const totalTodos = computed(() => todos.value.length)
  const activeTodos = computed(() => todos.value.filter((todo) => !todo.completed).length)
  const completedTodos = computed(() => todos.value.filter((todo) => todo.completed).length)

  // Actions
  const addTodo = async (todoData) => {
    try {
      const newTodo = await todoApi.createTodo(todoData)
      todos.value.push(newTodo)
      $q.notify({
        type: 'positive',
        message: 'Task created successfully!',
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: `Failed to create task: ${error.message}`,
      })
    }
  }

  const setFilter = async (newFilter) => {
    filter.value = newFilter
    await loadTodos() // Reload todos when filter changes
  }

  const toggleTodo = async (id) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      try {
        const updatedTodo = await todoApi.toggleTodoStatus(id, !todo.completed, todo.version)
        const index = todos.value.findIndex((t) => t.id === id)
        if (index !== -1) {
          todos.value[index] = updatedTodo
        }
        $q.notify({
          type: 'positive',
          message: 'Task status updated successfully!',
        })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `Failed to update task status: ${error.message}`,
        })
      }
    }
  }

  const deleteTodo = async (id) => {
    try {
      await todoApi.deleteTodo(id)
      const index = todos.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        todos.value.splice(index, 1)
      }
      $q.notify({
        type: 'positive',
        message: 'Task deleted successfully!',
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: `Failed to delete task: ${error.message}`,
      })
    }
  }

  const updateTodo = async (id, updates) => {
    const todo = todos.value.find((t) => t.id === id)
    if (!todo) return

    try {
      const updatedTodo = await todoApi.updateTodo(id, updates, todo.version)
      const index = todos.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
      $q.notify({
        type: 'positive',
        message: 'Task updated successfully!',
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: `Failed to update task: ${error.message}`,
      })
    }
  }

  const loadTodos = async () => {
    loading.value = true
    try {
      const status = filter.value
      todos.value = await todoApi.getTodos(status)
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: `Failed to load tasks: ${error.message}`,
      })
    } finally {
      loading.value = false
    }
  }

  return {
    todos,
    filter,
    loading,
    filteredTodos,
    totalTodos,
    activeTodos,
    completedTodos,
    addTodo,
    setFilter,
    toggleTodo,
    deleteTodo,
    updateTodo,
    loadTodos,
  }
})
