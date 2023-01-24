export const apiPost = async (endpoint, { data }) => {
  const body = data ? JSON.stringify(data) : null
  return await fetch(endpoint, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json())
}

export const apiGet = async (endpoint) => {
  return await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json())
}
