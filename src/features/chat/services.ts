export const postChat = async (message: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data)
    }

    return data
  } catch (err: unknown) {
    console.error(err)

    throw err
  }
}
