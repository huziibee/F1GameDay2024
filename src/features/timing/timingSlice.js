import {radioMessageTtl, windowSize, bufferThreshold, seekLookbackSize} from '../../constants';
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  offset: 0,
  window: {
    from: 0,
    to: windowSize
  },
  currentData: {},
  timingEvents: [],
}

const getWindow = (offset, existingWindow=null) => {
    // no existing data so expand the window
    if (!existingWindow) {
        return {from: Math.max(0, offset - seekLookbackSize), to: offset + windowSize}
    }

    if (offset + (windowSize*bufferThreshold) >= existingWindow.to) {
        const from = Math.max(offset, existingWindow?.to)
        return {from, to: from + windowSize}
    }

    return existingWindow
}

const getCurrentDataForOffset = (offset, existingData, timingEvents) => {
  let newData = {...existingData}
  let newQ = [...timingEvents]
  while (newQ.length > 0) {
    const i = newQ.shift()
    if (i.offset < offset) {
      i.data.forEach(({car, ...rest}) => {
        const existing = newData[car] ?? {}
        const existingRadio = existing.radio ?? []
        let value
        if (i.eventType === "RADIO") {
          // If 2 radio messages for the same car are with 0.01s of each other there is a duplicate
          const isDuplicate = !!existingRadio.find(i => {
            const originalOffset = i.showFrom + windowSize
            return Math.abs(originalOffset - offset) < 0.01
          })
          value = isDuplicate ? existingRadio : existingRadio.concat({
            ...rest,
            showFrom: offset - windowSize,
            showUntil: offset + radioMessageTtl,
          })
        } else {
          value = {
            ...(existing[i.eventType.toLowerCase()] ?? {}),
            ...rest,
          }
        }
        newData[car] = {
          ...existing,
          [i.eventType.toLowerCase()]: value
        }
      })
    } else {
      newQ.unshift(i);
      break;
    }
  }
  return [newData, newQ]
}

export const selectRadioMessages = (state) => Object
  .entries(state.timing.currentData)
  .reduce((acc, next) => acc.concat((next[1].radio ?? []).map(i => ({
    ...i,
    racingNumber: next[0],
  }))), [])
  .filter(i => state.timing.offset > i.showFrom && state.timing.offset < i.showUntil)

export const timingSlice = createSlice({
  name: 'timing',
  initialState,
  reducers: {
    seek: (state, action) => {
      const offset = action.payload;
      return {
        ...state,
        offset: offset,
        window: getWindow(offset),
        currentData: {},
        timingEvents: []
      }
    },
    queueEvents: (state, action) => {
      return {
        ...state,
        timingEvents: state.timingEvents.concat(action.payload)
      }
    },
    updateOffset: (state, action) => {
      if (action.payload === null) return state;
      const offset = action.payload;
      let [currentData, timingEvents] = getCurrentDataForOffset(offset, state.currentData, state.timingEvents)

      return {
        ...state,
        offset: offset,
        window: getWindow(offset, state.window),
        currentData,
        timingEvents,
      };
    },
  },
})

// Action creators are generated for each case reducer function
export const {updateOffset, queueEvents, seek} = timingSlice.actions

export default timingSlice.reducer
