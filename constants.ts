
import { NodeClass, ParticleType } from './types';

export const PHYSICS = {
  PI: Math.PI,
  VIBRATION_INTENSITY: 0.15,
  DAMPING: 0.98,
  CONNECTION_DISTANCE: 140,
  NODE_RADIUS: {
    [NodeClass.A]: 14,
    [NodeClass.B]: 12,
    [NodeClass.C]: 10
  },
  // Constantes Físicas Exactas
  C: 299792458,
  G: 6.67430e-11,
  HBAR: 1.054571817e-34,
  KB: 1.380649e-23,
  
  // Derivadas con π
  ALPHA_THEORETICAL: 1/137.035999,
  HUBBLE_THEORETICAL: 67.4, // km/s/Mpc
  PLANCK_LENGTH: Math.sqrt((1.054571817e-34 * 6.67430e-11) / Math.pow(299792458, 3)),
  
  OPTIMIZED_THEORY: {
    alpha: 1e-4, 
    beta: 1e-6,
    mu_scale: Math.PI / Math.sqrt((1.054571817e-34 * 6.67430e-11) / Math.pow(299792458, 3)) // Escala μ con π
  }
};

export const NODE_CONFIG = {
  [NodeClass.A]: { color: '#FF4444', charge: 3, label: '+1/3' },
  [NodeClass.B]: { color: '#4444FF', charge: -2, label: '-2/9' },
  [NodeClass.C]: { color: '#44FF44', charge: -1, label: '-1/9' }
};

export const INITIAL_MASTER_STATE = [
  // PROTON: 2 Up + 1 Down
  { id: 'p1', type: NodeClass.A, x: 400, y: 300, charge: 6, mass: 1 },
  { id: 'p2', type: NodeClass.A, x: 430, y: 340, charge: 6, mass: 1 },
  { id: 'p3', type: NodeClass.B, x: 370, y: 340, charge: -3, mass: 1 },
  // ELECTRON
  { id: 'e1', type: NodeClass.C, x: 600, y: 300, charge: -9, mass: 0.0005 }
];

export const PARTICLE_FORMULAS: Record<string, { label: string, combination: string, charge: string }> = {
  'quark-up': { label: 'Quark Up', combination: 'acc + aac + abc', charge: '+2/3 e' },
  'quark-down': { label: 'Quark Down', combination: 'ccc + bcc + aab', charge: '-1/3 e' },
  'electron': { label: 'Electrón', combination: 'b + bb + ccc', charge: '-1 e' },
  'neutrino': { label: 'Neutrino', combination: 'aaa + bbb + ccc', charge: '0 e' }
};
