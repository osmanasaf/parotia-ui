export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { page = 1 } = query

  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'
    
    const response = await $fetch(`${baseUrl}/movies/popular`, {
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
    console.error('Popular movies API error:', error)
    
    // Fallback mock data
    return {
      success: true,
      data: {
        page: 1,
        total_pages: 1,
        total_results: 8,
        results: [
          { id: 550, title: "Fight Club", poster_path: null, vote_average: 8.8, overview: "A man's journey into an underground fight club...", release_date: "1999-10-15" },
          { id: 680, title: "Pulp Fiction", poster_path: null, vote_average: 8.9, overview: "Interconnected stories of criminals in Los Angeles...", release_date: "1994-10-14" },
          { id: 13, title: "Forrest Gump", poster_path: null, vote_average: 8.8, overview: "The life story of a simple man...", release_date: "1994-07-06" },
          { id: 278, title: "The Shawshank Redemption", poster_path: null, vote_average: 9.3, overview: "Two imprisoned men bond over a number of years...", release_date: "1994-09-23" },
          { id: 238, title: "The Godfather", poster_path: null, vote_average: 9.2, overview: "The aging patriarch of an organized crime dynasty...", release_date: "1972-03-24" },
          { id: 424, title: "Schindler's List", poster_path: null, vote_average: 8.9, overview: "A businessman saves the lives of over a thousand Jewish refugees...", release_date: "1993-12-15" },
          { id: 389, title: "12 Angry Men", poster_path: null, vote_average: 8.9, overview: "A jury holdout attempts to prevent a miscarriage of justice...", release_date: "1957-04-10" },
          { id: 129, title: "Spirited Away", poster_path: null, vote_average: 8.6, overview: "A young girl wanders into a world ruled by gods and spirits...", release_date: "2001-07-20" }
        ]
      }
    }
  }
}) 