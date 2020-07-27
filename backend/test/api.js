import axios from 'axios'

const getData = res => res.data
const resolve = e => e

const getCookies = res => {
  if (!res.headers['set-cookie']) return null
  return res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
}

const api = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: require('axios/lib/adapters/http'),
})

// Helper utility to create better error messages
api.interceptors.response.use(
  function onSuccess(response) {
    return {data: getData(response), cookies: getCookies(response)}
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
  return await api.post(process.env.API_URL, {
    query: `
              mutation ($login: String!, $password: String!){
                  signIn(login: $login, password: $password) {
                      id
                      email
                      username
                  }
              }
          `,
    variables: {login: email, password: password},
  })
}

async function authRequest(query, variables, cookie) {
  const {data} = await api.post(
    process.env.API_URL,
    {
      query,
      variables,
    },
    {
      headers: {
        Cookie: cookie,
      },
    },
  )

  return data
}

async function expectedErrorRequest(query, variables, headers) {
  const {data} = await api
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

  return data
}

export default api

export {getData, resolve, loginUser, expectedErrorRequest, authRequest}
