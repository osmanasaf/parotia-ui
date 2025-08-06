export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { page = 1 } = query

  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'
    
    const response = await $fetch(`${baseUrl}/tv/popular`, {
      method: 'GET',
      params: { page },
      headers: {
        'accept': 'application/json'
      }
    })

    return {
      success: true,
      data: response.data || response
    }
  } catch (error) {
    console.error('Popular TV shows API error:', error)
    
    // Fallback mock data
    return {
      success: true,
      data: {
        page: 1,
        total_pages: 1,
        total_results: 5,
        results: [
          { id: 1399, name: "Game of Thrones", poster_path: null, vote_average: 9.2, overview: "Nine noble families fight for control over the lands of Westeros...", first_air_date: "2011-04-17" },
          { id: 94605, name: "Arcane", poster_path: null, vote_average: 9.0, overview: "Amid the stark discord of twin cities Piltover and Zaun...", first_air_date: "2021-11-06" },
          { id: 85271, name: "WandaVision", poster_path: null, vote_average: 8.4, overview: "Wanda Maximoff and Vision are living ideal suburban lives...", first_air_date: "2021-01-15" },
          { id: 71712, name: "The Good Place", poster_path: null, vote_average: 8.2, overview: "Four people and their otherworldly friar struggle in the afterlife...", first_air_date: "2016-09-19" },
          { id: 66732, name: "Stranger Things", poster_path: null, vote_average: 8.7, overview: "When a young boy disappears, his mother must confront terrifying forces...", first_air_date: "2016-07-15" }
        ]
      }
    }
  }
}) 