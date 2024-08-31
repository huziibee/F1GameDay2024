import { configureStore } from '@reduxjs/toolkit'
import timingSlice from './features/timing/timingSlice';
import driversSlice from './features/drivers/driversSlice'
import eventSlice from './features/event/eventSlice'


export const store = configureStore({
    reducer: {
        timing: timingSlice,
        drivers: driversSlice,
        event: eventSlice,
    },
})


