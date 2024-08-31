import rblogo from './RedBull.jpeg';
import merclogo from './Mercedes.jpeg';
import mclaren from './McLaren.jpeg';
import alpine from './Alpine.jpeg';
import williams from './WilliamsRacing.jpeg';
import astonmartin from './AstonMartin.jpeg';
import alfaromeo from './AlfaRomeo.png';
import alphatauri from './AlphaTauri.jpeg';
import ferrari from './Ferrari.jpeg';
import haas from './Haas.jpeg';

const teamLogoMap = {
  "Red Bull Racing": rblogo,
  "Mercedes": merclogo,
  "Ferrari": ferrari,
  "Aston Martin": astonmartin,
  "AlphaTauri": alphatauri,
  "Williams": williams,
  "Alfa Romeo": alfaromeo,
  "Haas F1 Team": haas,
  "Alpine": alpine,
  "McLaren": mclaren,
}

export const getLogo = team => teamLogoMap[team]


export default getLogo;
