<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="block text-sm font-medium text-white/90 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :maxlength="maxlength"
      :inputmode="inputmode"
      :class="[
        'w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-colors',
        error ? 'border-red-400 focus:ring-red-400' : 'border-white/20 focus:ring-blue-500',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/15'
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      @keyup.enter="$emit('keyup-enter', $event)"
    />
    
    <p v-if="error" class="mt-1 text-sm text-red-400">
      {{ error }}
    </p>
    
    <p v-if="hint" class="mt-1 text-sm text-white/60">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: [Number, String],
    default: undefined
  },
  inputmode: {
    type: String,
    default: undefined
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue', 'blur', 'focus', 'keyup-enter'])
</script> 