
import { TelemetryData } from '../types';

export const fetchTelemetry = async (): Promise<TelemetryData> => {
  // Simulating external API calls to NASA/LIGO
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        hubbleConstant: 73.2 + (Math.random() - 0.5),
        alpha: 0.00729735256,
        gravityWaves: "Detectadas en Virgo/LIGO (Evento GW170817)",
        // Added missing nasaGravity field as required by the TelemetryData interface
        nasaGravity: 9.80665 + (Math.random() - 0.5) * 0.01
      });
    }, 1500);
  });
};
