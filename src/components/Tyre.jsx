import {Box} from "@mui/material";

export const compoundColours = {
  "SOFT": "red",
  "MEDIUM": "yellow",
  "HARD": "white",
  "INTER": "green",
  "WET": "blue",
}
const Tyre = ({compound}) => {
  const color = compoundColours[compound]
  return <Box sx={{background: "#393939", border: `2px solid ${color}`, width: 25, height: 25, color: "white", borderRadius: "100%", paddingTop: "1px"}}>
    {compound[0]}
  </Box>
}

export default Tyre
