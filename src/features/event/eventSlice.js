import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        setEvent: (state, action) => {
            return action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setEvent } = eventSlice.actions

export default eventSlice.reducer
