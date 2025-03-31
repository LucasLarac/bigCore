// Home.vue
<template>
  <div style="padding: 40px;">
    <div style="background-color: #f5f5f5; padding: 5px 15px; font-size: 20px;">
      <p>TESTE TÉCNICO - BIGCORE</p>
    </div>

    <div class="filter" style="display: flex; justify-content: space-between; padding: 5px 15px; margin: 20px 0;">
      <div style="display: flex; align-items: center; gap: 5px;">
        <span>Consulta hodômetro</span>
        <img src="../../public/img/filtro.png" @click="showFilter = true" alt="filtro" style="width: 15px; cursor: pointer;" />
      </div>
      <div>
        <img src="../../public/img/engrenagem.png" @click="showOption = true" alt="engrenagem" style="width: 20px; cursor: pointer;" />
      </div>
    </div>

    <v-data-table-server
      class="elevation-1"
      :headers="filteredHeaders"
      :items="vehicles"
      :items-length="totalItems"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :items-per-page-options="[10, 15, 20]"
      :loading="loading"
      show-current-page
      show-first-last-page
    />

    <OptionDialog v-model="showOption" @update:fields="handleUpdateFields" />
    <SelectDialog v-model="showFilter" @applyFilters="applyFilters" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import api from '../services/api'
import OptionDialog from '@/components/OptionDialog.vue'
import SelectDialog from '@/components/SelectDialog.vue'

const showOption = ref(false)
const showFilter = ref(false)

const allHeaders = [
  { key: 'vehicleId', title: 'Frota' },
  { key: 'operationName', title: 'Operacao' },
  { key: 'divisionName', title: 'Divisao' },
  { key: 'licensePlate', title: 'Placa' },
  { key: 'odometerKm', title: 'Hodometro' },
  { key: 'speed', title: 'Velocidade' },
  { key: 'moving', title: 'Status Veiculo' },
  { key: 'ignitionStatus', title: 'Ignicao' },
  { key: 'driverName', title: 'Motorista' },
  { key: 'dateProcess', title: 'Data de Processamento' }
]

const visibleColumns = ref<{ key: string; title: string }[]>([])
const fields = ref('')

const loadHeaderSettings = () => {
  const savedFields = localStorage.getItem('visibleFields')
  const savedColumns = localStorage.getItem('visibleColumns')
  if (savedFields && savedColumns) {
    fields.value = savedFields
    visibleColumns.value = JSON.parse(savedColumns)
  } else {
    fields.value = allHeaders.map(h => h.key).join(',')
    visibleColumns.value = [...allHeaders]
  }
}

loadHeaderSettings()

const filteredHeaders = computed(() =>
  visibleColumns.value.map(col => ({
    key: col.key,
    title: col.title || col.label
  }))
)

const vehicles = ref([])
const totalItems = ref(0)
const page = ref(1)
const itemsPerPage = ref(10)
const loading = ref(false)

const startDate = ref('2025-03-01')
const endDate = ref('2025-03-30')
const vehicleId = ref('')
const licensePlate = ref('')
const divisions = ref<string[]>([])

const toISOStringUTC = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toISOString().slice(0, 16) + 'Z'
}

const applyFilters = (filtros: {
  startDate: string
  endDate: string
  vehicleId: string
  licensePlate: string
  divisions: number[]
}) => {
  startDate.value = toISOStringUTC(filtros.startDate)
  endDate.value = toISOStringUTC(filtros.endDate)
  vehicleId.value = filtros.vehicleId
  licensePlate.value = filtros.licensePlate
  divisions.value = filtros.divisions.map(String)

  localStorage.setItem('vehicleFilters', JSON.stringify(filtros))

  fetchVehicles()
}

const fetchVehicles = async () => {
  loading.value = true
  try {
    const response = await api.get('Odometer', {
      params: {
        startDate: startDate.value,
        endDate: endDate.value,
        fields: fields.value,
        page: page.value - 1,
        rows: itemsPerPage.value,
        IdTms: vehicleId.value ? [vehicleId.value] : undefined,
        LicensePlate: licensePlate.value?.trim() ? [licensePlate.value.trim()] : undefined,
        DivisionId: divisions.value.length ? divisions.value : undefined
      }
    })

    vehicles.value = response.data.data.map((v: any) => ({
      ...v,
      dateProcess: formatDate(v.dateProcess),
      moving: v.moving ? 'Em movimento' : 'Parado',
      speed: `${v.speed} Km/h`,
      odometerKm: `${v.odometerKm} Km`
    }))

    totalItems.value = response.data.totalItems
  } catch (error) {
    console.error('Erro ao buscar veículos:', error)
  } finally {
    loading.value = false
  }
}

const handleUpdateFields = ({ fields: f, columns }: { fields: string, columns: { key: string, label: string }[] }) => {
  fields.value = f
  visibleColumns.value = columns.map(c => ({
    key: c.key,
    title: c.label
  }))
  localStorage.setItem('visibleFields', f)
  localStorage.setItem('visibleColumns', JSON.stringify(visibleColumns.value))

  fetchVehicles()
}

watch([page, itemsPerPage], fetchVehicles)
onMounted(() => {
  const savedFilters = localStorage.getItem('vehicleFilters')
  if (savedFilters) {
    const parsed = JSON.parse(savedFilters)
    startDate.value = parsed.startDate
    endDate.value = parsed.endDate
    vehicleId.value = parsed.vehicleId
    licensePlate.value = parsed.licensePlate
    divisions.value = parsed.divisions
  }

  fetchVehicles()
})

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style>
.filter span {
  color: black;
}

thead {
  background-color: #f0f0f0 !important;
  color: #000 !important;
  font-weight: bold;
}
</style>