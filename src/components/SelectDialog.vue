<template>
  <v-dialog v-model="internalValue" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Filtro</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <div class="mb-3">
            <label>Intervalo de data</label>
            <div style="display: flex; gap: 10px;">
              <v-text-field
                v-model="startDate"
                type="date"
                label="De"
                :rules="[v => !!v || 'Obrigatório']"
                dense
                hide-details="auto"
              />
              <v-text-field
                v-model="endDate"
                type="date"
                label="Até"
                :rules="[v => !!v || 'Obrigatório']"
                dense
                hide-details="auto"
              />
            </div>
          </div>

          <v-text-field v-model="vehicleId" label="Frota" dense />
          <v-text-field v-model="licensePlate" label="Placa" dense />

          <v-select
            v-model="selectedDivisions"
            :items="divisions"
            label="Divisão"
            item-title="name"
            item-value="id"
            multiple
            dense
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="black" @click="submitFilters">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'applyFilters', payload: {
    startDate: string
    endDate: string
    vehicleId: string
    licensePlate: string
    divisions: number[]
  }): void
}>()

const internalValue = ref(props.modelValue)
watch(() => props.modelValue, val => (internalValue.value = val))
watch(internalValue, val => emit('update:modelValue', val))

const close = () => (internalValue.value = false)

const startDate = ref('')
const endDate = ref('')
const vehicleId = ref('')
const licensePlate = ref('')
const valid = ref(true)
const form = ref()

const divisions = [
  { id: 39, name: 'Citrosuco' },
  { id: 42, name: 'GLP' },
  { id: 45, name: 'Amônia' },
  { id: 46, name: 'Máquinas' },
  { id: 55, name: 'Ácido' },
  { id: 58, name: 'Treinamento' }
]
const selectedDivisions = ref<number[]>(divisions.map(d => d.id))


const submitFilters = () => {
  form.value?.validate()
  if (!valid.value) return

  emit('applyFilters', {
    startDate: startDate.value,
    endDate: endDate.value,
    vehicleId: vehicleId.value,
    licensePlate: licensePlate.value,
    divisions: selectedDivisions.value
  })

  close()
}
</script>
