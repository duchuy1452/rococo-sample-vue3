<template>
  <q-page class="profile-page q-pa-md">
    <div class="content-wrapper">
      <q-card class="user-profile-card q-pa-none">
        <!-- Header section with background -->
        <div class="profile-header q-pa-lg text-white">
          <div class="text-center">
            <q-avatar size="120px" class="profile-avatar">
              <q-img v-if="false" src="" spinner-color="white" />
              <template v-else>
                {{ initials }}
              </template>
            </q-avatar>
            <h5 class="q-mt-md q-mb-none">{{ formData.first_name }} {{ formData.last_name }}</h5>
            <p class="q-mb-none text-subtitle1">{{ formData.email_address }}</p>
          </div>
        </div>

        <q-card-section class="q-pa-lg">
          <div class="text-h6 q-mb-md">
            Profile Information
            <q-btn
              v-if="!isEditing"
              flat
              round
              color="primary"
              icon="edit"
              size="sm"
              @click="startEditing"
              class="float-right"
            >
              <q-tooltip>Edit Profile</q-tooltip>
            </q-btn>
          </div>

          <!-- View Mode -->
          <div v-if="!isEditing" class="q-gutter-y-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div class="profile-field">
                  <div class="profile-label">First Name</div>
                  <div class="profile-value">{{ formData.first_name }}</div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="profile-field">
                  <div class="profile-label">Last Name</div>
                  <div class="profile-value">{{ formData.last_name }}</div>
                </div>
              </div>

              <div class="col-12">
                <div class="profile-field">
                  <div class="profile-label">Email Address</div>
                  <div class="profile-value">{{ formData.email_address }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
          <q-form v-else @submit.prevent="onSubmit" class="q-gutter-y-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.first_name"
                  label="First Name"
                  outlined
                  :rules="[(val) => !!val || 'First name is required']"
                  class="profile-input"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.last_name"
                  label="Last Name"
                  outlined
                  :rules="[(val) => !!val || 'Last name is required']"
                  class="profile-input"
                />
              </div>

              <div class="col-12">
                <div class="profile-field">
                  <div class="profile-label">Email Address</div>
                  <div class="profile-value text-grey-7">{{ formData.email_address }}</div>
                  <div class="text-caption text-grey-7">Email address cannot be changed</div>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn
                flat
                label="Cancel"
                color="grey-7"
                @click="cancelEditing"
                :disable="updating"
                class="profile-btn"
              />
              <q-btn
                unelevated
                label="Save Changes"
                color="primary"
                type="submit"
                :loading="updating"
                class="profile-btn"
              />
            </div>
          </q-form>
        </q-card-section>

        <!-- Change Password Section -->
        <q-separator />

        <q-card-section class="q-pa-lg">
          <q-expansion-item
            icon="key"
            label="Change Password"
            caption="Update your account password"
            class="password-expansion"
            header-class="text-primary"
          >
            <q-card flat bordered class="q-mt-md">
              <q-card-section>
                <q-form @submit.prevent="onChangePassword" class="q-gutter-y-md">
                  <q-input
                    v-model="passwordData.current"
                    label="Current Password"
                    type="password"
                    outlined
                    :rules="[(val) => !!val || 'Current password is required']"
                    class="profile-input"
                  />

                  <q-input
                    v-model="passwordData.new"
                    label="New Password"
                    type="password"
                    outlined
                    :rules="passwordRules"
                    class="profile-input"
                  />

                  <q-input
                    v-model="passwordData.confirm"
                    label="Confirm New Password"
                    type="password"
                    outlined
                    :rules="[
                      (val) => !!val || 'Please confirm your password',
                      (val) => val === passwordData.new || 'Passwords do not match',
                    ]"
                    class="profile-input"
                  />

                  <div class="row justify-end q-mt-md">
                    <q-btn
                      unelevated
                      label="Update Password"
                      color="primary"
                      type="submit"
                      :loading="changingPassword"
                      class="profile-btn"
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from 'stores/auth'
import { Notify } from 'quasar'
import axios from 'config/axios'

const authStore = useAuthStore()

// Form data
const formData = ref({
  first_name: authStore.user?.first_name || '',
  last_name: authStore.user?.last_name || '',
  email_address: authStore.user?.email || '',
  entity_id: authStore.user?.entity_id || '',
})

// Password change data
const passwordData = ref({
  current: '',
  new: '',
  confirm: '',
})

// UI states
const isEditing = ref(false)
const updating = ref(false)
const changingPassword = ref(false)

// Computed
const initials = computed(() => {
  const first = formData.value.first_name?.charAt(0) || ''
  const last = formData.value.last_name?.charAt(0) || ''
  return (first + last).toUpperCase()
})

// Password validation rules
const passwordRules = [
  (val) => !!val || 'Password is required',
  (val) => val.length >= 8 || 'Password must be at least 8 characters',
  (val) => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
  (val) => /[a-z]/.test(val) || 'Password must contain at least one lowercase letter',
  (val) => /[0-9]/.test(val) || 'Password must contain at least one number',
]

// Methods
function startEditing() {
  isEditing.value = true
}

function cancelEditing() {
  formData.value = {
    first_name: authStore.user?.first_name || '',
    last_name: authStore.user?.last_name || '',
    email_address: authStore.user?.email_address || '',
  }
  isEditing.value = false
}

async function onSubmit() {
  try {
    updating.value = true
    const entity_id = formData.value.entity_id
    const response = await axios.put(`/person/${entity_id}`, {
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
    })

    if (response.data?.success) {
      // Update the store
      authStore.user = {
        ...authStore.user,
        first_name: formData.value.first_name,
        last_name: formData.value.last_name,
      }

      Notify.create({
        message: 'Profile updated successfully',
        color: 'positive',
      })

      isEditing.value = false
    }
  } catch (error) {
    Notify.create({
      message: error.response?.data?.message || 'Failed to update profile',
      color: 'negative',
    })
  } finally {
    updating.value = false
  }
}

async function onChangePassword() {
  try {
    changingPassword.value = true
    const response = await axios.put('/auth/change-password', {
      current_password: passwordData.value.current,
      new_password: passwordData.value.new,
    })

    if (response.data?.success) {
      Notify.create({
        message: 'Password changed successfully',
        color: 'positive',
      })

      // Reset password form
      passwordData.value = {
        current: '',
        new: '',
        confirm: '',
      }
    }
  } catch (error) {
    Notify.create({
      message: error.response?.data?.message || 'Failed to change password',
      color: 'negative',
    })
  } finally {
    changingPassword.value = false
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 0;
}

.user-profile-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-header {
  background: linear-gradient(
    135deg,
    var(--q-primary) 0%,
    color.adjust($primary, $lightness: -15%) 100%
  );
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
}

.profile-avatar {
  border: 4px solid white;
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
}

.profile-field {
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  transition: background 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
}

.profile-label {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}

.profile-value {
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
}

.profile-input {
  .q-field__control {
    height: 56px;
  }
}

.profile-btn {
  min-width: 120px;
  padding: 8px 24px;
}

.password-expansion {
  .q-expansion-item__container {
    border-radius: 8px;
  }
}

// Responsive adjustments
@media (max-width: 599px) {
  .content-wrapper {
    padding: 0;
  }

  .user-profile-card {
    border-radius: 0;
  }

  .profile-header {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }

  .profile-avatar {
    size: 100px;
    font-size: 2rem;
  }

  .q-card-section {
    padding: 16px !important;
  }

  .profile-btn {
    width: 100%;
    margin: 4px 0 !important;
  }

  .row.justify-end {
    justify-content: stretch;
  }

  .profile-field {
    padding: 8px 12px;
  }
}

// Dark mode support
.body--dark {
  .profile-page {
    background: #1d1d1d;
  }

  .user-profile-card {
    background: #2d2d2d;
  }

  .profile-field {
    background: rgba(255, 255, 255, 0.03);

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  .profile-label {
    color: rgba(255, 255, 255, 0.6);
  }

  .profile-value {
    color: rgba(255, 255, 255, 0.87);
  }
}
</style>
