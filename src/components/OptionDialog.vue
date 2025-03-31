<template>
  <v-dialog v-model="internalValue" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Configuração</v-card-title>
      <v-card-text>
        <div>
          <v-select
            v-model="newColumn"
            :items="availableColumns"
            item-title="label"
            item-value="key"
            label="Colunas"
            dense
            clearable
          />
          <v-btn icon @click="addColumn">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>

        <div style="margin-top: 20px;">
          <strong>Colunas Visíveis:</strong>
          <v-list dense>
            <v-list-item
              v-for="(col, index) in visibleColumns"
              :key="col.key"
              style="border: 1px solid black; margin-bottom: 4px;"
            >
              <v-list-item-title>{{ col.label }}</v-list-item-title>
              <v-spacer />
              <v-btn icon @click="moveUp(index)" :disabled="index === 0">
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
              <v-btn icon @click="moveDown(index)" :disabled="index === visibleColumns.length - 1">
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
              <v-btn icon @click="removeColumn(index)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="black" @click="applyChanges">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:fields', payload: { fields: string; columns: { key: string; label: string }[] }): void
}>()

const internalValue = ref(props.modelValue)
watch(() => props.modelValue, val => (internalValue.value = val))
watch(internalValue, val => emit('update:modelValue', val))
const close = () => (internalValue.value = false)

const allColumns = [
  { key: 'vehicleId', label: 'Frota' },
  { key: 'operationName', label: 'Operação' },
  { key: 'divisionName', label: 'Divisão' },
  { key: 'licensePlate', label: 'Placa' },
  { key: 'odometerKm', label: 'Hodômetro' },
  { key: 'speed', label: 'Velocidade' },
  { key: 'moving', label: 'Status Veículo' },
  { key: 'ignitionStatus', label: 'Ignição' },
  { key: 'driverName', label: 'Motorista' },
  { key: 'dateProcess', label: 'Data de Processamento' }
]

const visibleColumns = ref<{ key: string; label: string }[]>([])

const saved = localStorage.getItem('visibleColumns')
if (saved) {
  visibleColumns.value = JSON.parse(saved)
} else {
  visibleColumns.value = [...allColumns] // padrão
}
const newColumn = ref(null)

const availableColumns = computed(() =>
  allColumns.filter(col => !visibleColumns.value.find(v => v.key === col.key))
)

const addColumn = () => {
  const col = allColumns.find(c => c.key === newColumn.value)
  if (col && !visibleColumns.value.find(c => c.key === col.key)) {
    visibleColumns.value.push(col)
    newColumn.value = null
  }
}

const removeColumn = (index: number) => {
  visibleColumns.value.splice(index, 1)
}

const moveUp = (index: number) => {
  if (index > 0) {
    const temp = visibleColumns.value[index]
    visibleColumns.value[index] = visibleColumns.value[index - 1]
    visibleColumns.value[index - 1] = temp
  }
}

const moveDown = (index: number) => {
  if (index < visibleColumns.value.length - 1) {
    const temp = visibleColumns.value[index]
    visibleColumns.value[index] = visibleColumns.value[index + 1]
    visibleColumns.value[index + 1] = temp
  }
}

const applyChanges = () => {
  const fields = visibleColumns.value.map(c => c.key).join(',')
  emit('update:fields', {
    fields,
    columns: [...visibleColumns.value]
  })
  localStorage.setItem('visibleColumns', JSON.stringify(visibleColumns.value))
localStorage.setItem('visibleFields', fields)

  close()
}
</script>
