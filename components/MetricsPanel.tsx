
import React, { useMemo } from 'react';
import { QuantumNode, NodeClass, TelemetryData } from '../types';

interface MetricsPanelProps {
  nodes: QuantumNode[];
  tick: number;
  aiInsight: string;
  telemetry: TelemetryData | null;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ nodes, tick, aiInsight, telemetry }) => {
  const { totalChargeRaw, status } = useMemo(() => {
    const sum = nodes.reduce((acc, node) => acc + node.charge, 0);
    let st = 'Neutro (Equilibrio)';
    if (sum > 0) st = 'Positivo (Condensación)';
    if (sum < 0) st = 'Tensión de Expansión';
    return { totalChargeRaw: sum, status: st };
  }, [nodes]);

  // Subtle fluctuations for real-time simulation based on simulation ticks
  const animatedTelemetry = useMemo(() => {
    if (!telemetry) return null;
    return {
      hubble: telemetry.hubbleConstant + Math.sin(tick * 0.02) * 0.04,
      gravity: telemetry.nasaGravity + Math.cos(tick * 0.035) * 0.0015,
      alpha: telemetry.alpha + Math.sin(tick * 0.05) * 0.0000000005
    };
  }, [telemetry, tick]);

  const chargeFormatted = `${(totalChargeRaw / 9).toFixed(4)} e`;

  return (
    <div className="w-80 h-full bg-black/40 border-l border-white/5 p-8 flex flex-col gap-8 backdrop-blur-2xl overflow-y-auto custom-scrollbar">
      <section>
        <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-6">Estado del Sistema</h2>
        <div className="space-y-4">
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-[9px] text-white/40 uppercase mb-1">Tic Cuántico</p>
            <p className="text-xl font-mono-tech text-cyan-400">{tick.toLocaleString()}</p>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-[9px] text-white/40 uppercase mb-1">Carga Neta (Σq)</p>
            <p className={`text-3xl font-mono-tech ${totalChargeRaw === 0 ? 'text-green-400' : 'text-red-400'}`}>
              {chargeFormatted}
            </p>
            <p className="text-[10px] mt-2 opacity-60 italic">{status}</p>
          </div>
        </div>
      </section>

      {telemetry && animatedTelemetry && (
        <section className="animate-in fade-in duration-1000">
          <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-6">Telemetría NASA/LIGO</h2>
          <div className="space-y-4">
            <div className="p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-cyan-500/5 animate-pulse" style={{ width: '100%' }} />
              <p className="text-[8px] text-cyan-400/60 uppercase mb-1">H₀ (Constante Hubble)</p>
              <div className="flex items-baseline gap-2 relative">
                <span className="text-lg font-mono-tech text-cyan-300">
                  {animatedTelemetry.hubble.toFixed(4)}
                </span>
                <span className="text-[8px] opacity-40">km/s/Mpc</span>
              </div>
            </div>
            <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-purple-500/5 animate-pulse" style={{ width: '100%' }} />
              <p className="text-[8px] text-purple-400/60 uppercase mb-1">Gravedad Local (g)</p>
              <div className="flex items-baseline gap-2 relative">
                <span className="text-lg font-mono-tech text-purple-300">
                  {animatedTelemetry.gravity.toFixed(6)}
                </span>
                <span className="text-[8px] opacity-40">m/s²</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Distribución de Nudos</h2>
        <div className="grid grid-cols-3 gap-2">
          {[NodeClass.A, NodeClass.B, NodeClass.C].map(type => (
            <div key={type} className="text-center py-2 bg-white/5 rounded-lg border border-white/10">
              <span className="text-[10px] block opacity-40 font-bold">{type}</span>
              <span className="text-sm font-mono-tech">
                {nodes.filter(n => n.type === type).length}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex-1 flex flex-col justify-end gap-4">
        <div className="bg-cyan-950/20 border border-cyan-500/20 p-5 rounded-xl relative">
          <div className="absolute -top-3 left-3 bg-black px-2 text-[9px] text-cyan-400 font-bold uppercase tracking-tighter border border-cyan-500/20 rounded">
            Exégesis Puente
          </div>
          <p className="text-[11px] leading-relaxed text-cyan-100/70 italic">
            "{aiInsight || "Sincronizando flujos de información..."}"
          </p>
        </div>
        <footer className="text-[9px] opacity-20 uppercase tracking-[0.2em] text-center">
          EDWARD LÓPEZ | PROYECTO ABC v3.0
        </footer>
      </section>
    </div>
  );
};
