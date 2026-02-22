import { ref } from 'vue'

export const useRoomSession = () => {
    const SESSION_KEY = 'movai_room_session_id'

    // UUID v4 generator fallback
    const generateUUID = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID()
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    const getSessionId = () => {
        if (!process.client) return null

        let sessionId = localStorage.getItem(SESSION_KEY)
        if (!sessionId) {
            sessionId = generateUUID()
            localStorage.setItem(SESSION_KEY, sessionId)
        }
        return sessionId
    }

    return {
        getSessionId
    }
}
