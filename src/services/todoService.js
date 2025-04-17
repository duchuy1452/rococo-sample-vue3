import apiClient from 'src/config/axios'
import dayjs from 'dayjs'

const formatDateFromAPI = (isoString) => {
  if (!isoString) return null
  return dayjs(isoString).format('YYYY/MM/DD')
}

const formatTodoFromAPI = (todo) => ({
  ...todo,
  dueDate: formatDateFromAPI(todo.due_date),
  completed: todo.is_completed,
})

const formatTodoToAPI = (todoData) => ({
  title: todoData.title,
  description: todoData.description,
  due_date: todoData.dueDate,
  priority: todoData.priority,
  is_completed: todoData.completed,
})

const handleResponse = (response) => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'Operation failed')
  }
  return response.data
}

export const todoApi = {
  getTodos: async (status = 'all') => {
    try {
      const url = status === 'all' ? '/todos/' : `/todos/?status=${status}`
      const response = await apiClient.get(url)
      const data = handleResponse(response)
      return data.data.map(formatTodoFromAPI)
    } catch (error) {
      console.error('Error fetching todos:', error)
      throw error
    }
  },

  createTodo: async (todoData) => {
    try {
      const response = await apiClient.post('/todos/', formatTodoToAPI(todoData))
      const data = handleResponse(response)
      return formatTodoFromAPI(data.data)
    } catch (error) {
      console.error('Error creating todo:', error)
      throw error
    }
  },

  updateTodo: async (id, updates, version) => {
    try {
      const response = await apiClient.put(`/todos/${id}`, {
        ...formatTodoToAPI(updates),
        id,
        version,
      })
      const data = handleResponse(response)
      return formatTodoFromAPI(data.data)
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  },

  toggleTodoStatus: async (id, isCompleted, version) => {
    try {
      const response = await apiClient.put(`/todos/${id}/complete`, {
        is_completed: isCompleted,
        version: version,
      })
      const data = handleResponse(response)
      return formatTodoFromAPI(data.data)
    } catch (error) {
      console.error('Error toggling todo status:', error)
      throw error
    }
  },

  deleteTodo: async (id) => {
    try {
      const response = await apiClient.delete(`/todos/${id}`)
      handleResponse(response)
    } catch (error) {
      console.error('Error deleting todo:', error)
      throw error
    }
  },

  clearCompleted: async () => {
    try {
      const response = await apiClient.post('/todos/clear-completed/')
      handleResponse(response)
    } catch (error) {
      console.error('Error clearing completed todos:', error)
      throw error
    }
  },
}
