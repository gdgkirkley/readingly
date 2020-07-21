import axios from 'axios'

const getData = res => res.data

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper utility to create better error messages
api.interceptors.response.use(
  function onSuccess(response) {
    return getData(response)
  },
  function onError(result) {
    throw new Error(
      `${result.response.status}: ${JSON.stringify(
        result.response.data.errors[0].message,
      )}`,
    )
  },
)

export default api

export {getData}
