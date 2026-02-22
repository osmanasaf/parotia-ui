let socket = null

export const useRoomWs = () => {
    const roomStore = useRoomStore()
    const config = useRuntimeConfig()
    const { getSessionId } = useRoomSession()

    const refreshRoomData = async (roomCode) => {
        try {
            const res = await $fetch(`${config.public.apiBaseUrl}/rooms/${roomCode}`)
            if (res) {
                roomStore.setRoomDetails(res)
                roomStore.setParticipants(res.participants || [])
            }
        } catch (e) {
            console.error('Failed to refresh room data:', e)
        }
    }

    const connect = (roomCode) => {
        if (socket) return

        const WS_BASE_URL = config.public.apiBaseUrl.replace('http', 'ws')
        const sessionId = getSessionId()
        const url = `${WS_BASE_URL}/rooms/${roomCode}/ws?session_id=${sessionId}`

        socket = new WebSocket(url)

        socket.onopen = () => {
            console.log('Movie Room WS Connected')
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            handleWsMessage(data)
        }

        socket.onerror = (error) => {
            console.error('Movie Room WS Error:', error)
        }

        socket.onclose = () => {
            console.log('Movie Room WS Closed')
            socket = null
        }
    }

    const disconnect = () => {
        if (socket) {
            socket.close()
            socket = null
        }
    }

    const handleWsMessage = (data) => {
        switch (data.type) {
            case 'user_joined':
                if (data.participants && Array.isArray(data.participants)) {
                    roomStore.setParticipants(data.participants)
                } else if (data.session_id) {
                    const existing = roomStore.participants.find(p => p.session_id === data.session_id)
                    if (!existing) {
                        roomStore.setParticipants([
                            ...roomStore.participants,
                            { session_id: data.session_id, user_id: null, mood: null, is_ready: false, submitted_mood: false }
                        ])
                    }
                }
                break
            case 'user_ready':
                roomStore.updateParticipantStatus(data.session_id || data.user_id, { ready: true, is_ready: true, submitted_mood: true })
                break
            case 'start_voting':
                roomStore.setRecommendations(data.recommendations)
                roomStore.setExpiresAt(data.expires_at)
                roomStore.setVotingActive(true)
                break
            case 'match_found':
                // Interim match mid-voting. Don't stop voting.
                const matchedTmdbId = data.tmdb_id
                const movie = roomStore.recommendations.find(m => m.tmdb_id === matchedTmdbId)
                if (movie) {
                    // Check if already in interim list
                    if (!roomStore.interimMatches.some(m => m.tmdb_id === movie.tmdb_id)) {
                        roomStore.setInterimMatches(movie)
                    }
                }
                break
            case 'voting_finished':
                // The final ranked list of matches
                if (data.matches && data.matches.length > 0) {
                    const enrichedMatches = data.matches.map(m => {
                        const rec = roomStore.recommendations.find(r => r.tmdb_id === m.tmdb_id)
                        return rec || m // fallback to basic ID if not found (shouldn't happen)
                    })
                    roomStore.setVotingResults(enrichedMatches)
                } else {
                    roomStore.setVotingResults([]) // Fallback in case matches array is empty
                }
                roomStore.setVotingActive(false)
                break
            case 'no_match':
                roomStore.setVotingResults([])
                roomStore.setVotingActive(false)
                break
            default:
                console.log('Unknown WS event:', data.type)
        }
    }

    const submitMood = (text) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'submit_mood',
                text
            }))
            roomStore.myStatus.submittedMood = true
        }
    }

    const sendSwipe = (tmdbId, action) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'swipe',
                tmdb_id: tmdbId,
                action // LIKE, DISLIKE, SUPERLIKE
            }))
        }
    }

    const forceStart = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'force_start'
            }))
        }
    }

    const forceFinish = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'force_finish'
            }))
        }
    }

    return {
        connect,
        disconnect,
        submitMood,
        sendSwipe,
        forceStart,
        forceFinish
    }
}
