# Components - Structure

When writing components, you should always follow this structure.

| Element                | Example                                                       |
| ---------------------- | ------------------------------------------------------------- |
| 1. Imports             | `import { defineProps, defineEmits } from 'vue';`             |
| 2. Props               | `const props = defineProps<{value: Person}>();`               |
| 3. Emits               | `const emit = defineEmits<{(e: 'change', value: Person)}>();` |
| 4. Composable          | `const { isLoading } = useLoading()`                          |
| 5. Refs                | `const isLoading = ref<boolean>(false)`                       |
| 6. Computed properties | `const isLoading = computed<boolean>(() => {})`               |
| 7. Methods             | `initForm() {}`                                               |
| 8. Lifecycle hooks     | `onMounted(() => {})`                                         |
| 9. defineExpose        | `defineExpose({})`                                            |
| 10. Template           | `<template>`                                                  |
| 11. Styles             | `<style scoped>`                                              |

Example of a well-structured component:

```vue
<script lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  value: Person,
}>();

const emit = defineEmits<{
  (e: 'change', value: Person),
}>();





const employeeStore = useEmployeeStore();

const isVisible = ref<boolean>(false);

const isLoading = computed<boolean>(() => {
  return employeeStore.isLoading;
});

const initForm = () => {
  isVisible.value = true;
};

onMounted(() => {
  initForm();
});

defineExpose({
  initForm,
});

</script>

<template>
  <div>
    <button @click="initForm">Add Employee</button>
    <div v-if="isVisible">
      <FormDropdown />
      <FormCurrencyInput />
      <FormSelectButton />
    </div>
  </div>
</template>

<style scoped>
.form {
   display: flex;
   flex-direction: column;
}
</style>
```
