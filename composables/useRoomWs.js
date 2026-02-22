export const useRoomWs = () => {
    const roomStore = useRoomStore()
    const config = useRuntimeConfig()
    const { getSessionId } = useRoomSession()

    let socket = null

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
                roomStore.setMatchFound(data.recommendations?.[0] || data.match || {
                    tmdb_id: data.tmdb_id,
                    title: data.message || "Eşleşme Bulundu!"
                })
                roomStore.setVotingActive(false)
                break
            case 'no_match':
                // Instead of a match, maybe show a generic no match message
                roomStore.setMatchFound({
                    tmdb_id: null,
                    title: "Eşleşme Bulunamadı",
                    overview: data.detail || "Kimse aynı yapıma oy vermedi."
                })
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
