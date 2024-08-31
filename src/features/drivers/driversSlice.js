import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selected: null,
    drivers: [],
}

export const driversSlice = createSlice({
    name: 'driver',
    initialState,
    reducers: {
        setDrivers: (state, action) => {
            return { ...state, drivers: action.payload }
        },
        selectDriver: (state, action) => {
            return  {...state, selected: state.drivers?.find(i => i.tla === action.payload) }
        },
    },
})

// Action creators are generated for each case reducer function
export const { selectDriver, setDrivers } = driversSlice.actions

export default driversSlice.reducer
