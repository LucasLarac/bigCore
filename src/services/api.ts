import axios from 'axios'
import qs from 'qs'

const api = axios.create({
  baseURL: 'http://localhost:5000/api/',
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' }) 
})

export default api
