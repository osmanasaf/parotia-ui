import { defineStore } from 'pinia'

export const useRoomStore = defineStore('room', {
    state: () => ({
        roomCode: null,
        roomDetails: null,
        participants: [],
        recommendations: [],
        votingActive: false,
        matchFound: null,
        myStatus: {
            ready: false,
            submittedMood: false
        },
        countdown: 0,
        expiresAt: null
    }),

    actions: {
        setRoomCode(code) {
            this.roomCode = code
        },
        setRoomDetails(details) {
            this.roomDetails = details
        },
        setParticipants(participants) {
            this.participants = participants
        },
        updateParticipantStatus(participantSessionId, status) {
            const p = this.participants.find(p => p.session_id === participantSessionId)
            if (p) Object.assign(p, status)
        },
        setRecommendations(list) {
            this.recommendations = list
        },
        setVotingActive(active) {
            this.votingActive = active
        },
        setMatchFound(match) {
            this.matchFound = match
        },
        setExpiresAt(time) {
            this.expiresAt = time
        },
        resetRoom() {
            this.roomCode = null
            this.roomDetails = null
            this.participants = []
            this.recommendations = []
            this.votingActive = false
            this.matchFound = null
            this.myStatus = {
                ready: false,
                submittedMood: false
            }
        }
    }
})
