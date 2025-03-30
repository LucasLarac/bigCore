<template>
    <div style="padding: 40px;">
        <div style="background-color: #f5f5f5; padding: 5px 15px; font-size: 20px;">
            <p>TESTE TÉCNICO - BIGCORE</p>
        </div>

        <div class="filter" style="display: flex; justify-content: space-between; padding: 5px 15px; margin: 20px 0;">
            <div><span>Consulta hodômetro</span></div>
            <div>Engrenagem</div>
        </div>

        <v-data-table class="elevation-1"
        :items="vehicles" 
        :items-per-page="itemsPerPage" @update:items-per-page="onItemsPerPageChange"
        :items-per-page-options="[10, 15, 20]" >
        </v-data-table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'





const startDate = ref('2025-03-01')
const endDate = ref('2025-03-30')
const itemsPerPage = ref(10)

const vehicles = ref([])
const fields = ref('')
const page = ref(0)

onMounted(() => {
  fetchVehicles()
})

const onItemsPerPageChange = (newVal: number) => {
  itemsPerPage.value = newVal
  fetchVehicles()
}

const fetchVehicles = async () => {
  try {
    const response = await api.get('Odometer', {
      params: {
        startDate: startDate.value,
        endDate: endDate.value,
        fields: fields.value,
        rows: itemsPerPage.value,
        page: page.value
      }
    })
    vehicles.value = response.data.data
    console.log(response.data)

  } catch (error) {
    console.error('Erro ao buscar veículos:', error)
  }
}



const division = [
  { id: 39, name: 'Citrosuco' },
  { id: 42, name: 'GLP' },
  { id: 45, name: 'Amônia' },
  { id: 46, name: 'Máquinas' },
  { id: 55, name: 'Ácido' },
  { id: 58, name: 'Treinamento' }
]


</script>


<style>

.filter span{
    color: black;
}

thead {
  background-color: #f0f0f0 !important;
  color: #000 !important;
  font-weight: bold;
}

</style>