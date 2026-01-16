
export enum NodeClass {
  A = 'A',
  B = 'B',
  C = 'C'
}

export interface QuantumNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: NodeClass;
  charge: number; // Numerator of n/9
  isHighlighted?: boolean;
  isDragging?: boolean;
  mass: number;
}

export interface Connection {
  sourceId: string;
  targetId: string;
  tension: number;
}

export type IAAgentType = 
  | 'Analista' 
  | 'Teórica' 
  | 'Geómetra' 
  | 'Termodinámica' 
  | 'Cosmóloga' 
  | 'Crítica' 
  | 'Puente';

export interface IALog {
  agent: IAAgentType;
  message: string;
  timestamp: string;
  type: 'info' | 'exito' | 'advertencia' | 'error';
}

export interface TelemetryData {
  hubbleConstant: number;
  alpha: number;
  gravityWaves: string;
  nasaGravity: number;
}

export type ParticleType = 'quark-up' | 'quark-down' | 'electron' | 'neutrino' | 'proton';
