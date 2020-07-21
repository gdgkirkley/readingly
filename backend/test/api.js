import axios from 'axios'

const getData = res => res.data
const resolve = e => e

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

async function loginUser(email, password) {
  const {data} = await api.post(process.env.API_URL, {
    query: `
              mutation ($login: String!, $password: String!){
                  signIn(login: $login, password: $password) {
                      token
                  }
              }
          `,
    variables: {login: email, password: password},
  })
  return data
}

async function authRequest(query, variables, token) {
  const {data} = await api.post(
    process.env.API_URL,
    {
      query,
      variables,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return data
}

async function expectedErrorRequest(query, variables, headers) {
  const result = await api
    .post(
      process.env.API_URL,
      {
        query,
        variables,
      },
      {
        headers,
      },
    )
    .catch(resolve)

  return result
}

export default api

export {getData, resolve, loginUser, expectedErrorRequest, authRequest}
