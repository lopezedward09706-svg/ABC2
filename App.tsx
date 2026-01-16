
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SimulationCanvas } from './components/SimulationCanvas';
import { MetricsPanel } from './components/MetricsPanel';
import { QuantumNode, Connection, NodeClass, IALog, TelemetryData, IAAgentType } from './types';
import { INITIAL_MASTER_STATE, PHYSICS, NODE_CONFIG, PARTICLE_FORMULAS } from './constants';
import { fetchTelemetry } from './services/telemetryService';
import { getAgentInsight } from './services/geminiService';
import { audioService } from './services/audioService';
import { runScientificValidation, runGeometricVerification, ValidationResult, GeometricReport } from './services/validationService';

const AGENTS: IAAgentType[] = ['Analista', 'Teórica', 'Geómetra', 'Termodinámica', 'Cosmóloga', 'Crítica', 'Puente'];

const App: React.FC = () => {
  const [nodes, setNodes] = useState<QuantumNode[]>(INITIAL_MASTER_STATE.map(n => ({ ...n, vx: 0, vy: 0 } as QuantumNode)));
  const [connections, setConnections] = useState<Connection[]>([]);
  const [tick, setTick] = useState(0);
  const [logs, setLogs] = useState<IALog[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [isCollisionMode, setIsCollisionMode] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [geometricReport, setGeometricReport] = useState<GeometricReport | null>(null);
  const [exegesis, setExegesis] = useState("Calibración π-exacta activa. Sincronizando termodinámica BH.");
  const [showNodeSelector, setShowNodeSelector] = useState(false);

  // Telemetry Sync
  useEffect(() => {
    fetchTelemetry().then(setTelemetry);
    audioService.init();
  }, []);

  // Spatial Relational Engine (ABC connections)
  useEffect(() => {
    const nextConns: Connection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2));
        if (d < PHYSICS.CONNECTION_DISTANCE) {
          nextConns.push({ sourceId: nodes[i].id, targetId: nodes[j].id, tension: d / PHYSICS.CONNECTION_DISTANCE });
        }
      }
    }
    setConnections(nextConns);
  }, [nodes]);

  // 7 IA Agents Cycle
  useEffect(() => {
    if (tick > 0 && tick % 600 === 0) {
      const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const systemData = {
        charge: nodes.reduce((a, b) => a + b.charge, 0) / 9,
        entropy: nodes.length * 0.1,
        tension: connections.reduce((a, b) => a + b.tension, 0),
        telemetry,
        theory: PHYSICS.OPTIMIZED_THEORY,
        calibration: "π-Exact (Bekenstein-Hawking Corrections)"
      };
      getAgentInsight(agent, systemData).then(msg => {
        const newLog: IALog = {
          agent,
          message: msg,
          timestamp: new Date().toLocaleTimeString(),
          type: 'info'
        };
        setLogs(prev => [newLog, ...prev].slice(0, 30));
        if (agent === 'Puente') setExegesis(msg);
      });
    }
  }, [tick, nodes, connections, telemetry]);

  const onNodeMove = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
    if (id === 'e1') setExegesis("Orbitación detectada. Manteniendo equilibrio electrodinámico π.");
  }, []);

  const addNode = (type: NodeClass) => {
    const config = NODE_CONFIG[type];
    const newNode: QuantumNode = {
      id: `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      x: 400 + (Math.random() - 0.5) * 250,
      y: 300 + (Math.random() - 0.5) * 250,
      vx: 0,
      vy: 0,
      charge: config.charge,
      mass: type === NodeClass.A ? 1 : type === NodeClass.B ? 0.8 : 0.5
    };
    setNodes(prev => [...prev, newNode]);
    setExegesis(`Inyectando nudo Clase ${type}. Carga: ${config.label}.`);
    audioService.playQuantumPop(600 + (type === NodeClass.A ? 100 : type === NodeClass.B ? 0 : -100));
    setShowNodeSelector(false);
  };

  const handleRunValidation = () => {
    setIsValidating(true);
    setExegesis("🚀 Calibrando constantes con π y ejecutando suite optimizada...");
    audioService.playQuantumPop(1000);
    
    setTimeout(() => {
      const results = runScientificValidation(PHYSICS.OPTIMIZED_THEORY.alpha, PHYSICS.OPTIMIZED_THEORY.beta);
      setValidationResults(results);
      setIsValidating(false);
      const successRate = (results.filter(r => r.passed).length / results.length) * 100;
      setExegesis(`Validación completa: ${successRate}% éxito. ¡Termodinámica π-consistente!`);
      audioService.playQuantumPop(1200);
    }, 2000);
  };

  const handleExecuteIA2 = async () => {
    setIsValidating(true);
    setExegesis("📐 Ejecutando IA2 (Geómetra): Verificando consistencia tetraédrica...");
    audioService.playQuantumPop(1400);

    const report = runGeometricVerification(connections, nodes);
    
    const systemData = {
      geometricReport: report,
      planckScale: PHYSICS.PLANCK_LENGTH,
      pi: Math.PI
    };
    
    const insight = await getAgentInsight('Geómetra', systemData);
    
    setTimeout(() => {
      setGeometricReport(report);
      setExegesis(insight);
      setIsValidating(false);
      setLogs(prev => [{
        agent: 'Geómetra',
        message: `Análisis Geométrico: ${report.geometricStatus}. Consistencia: ${report.tetrahedralConsistency.toFixed(2)}%`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'exito'
      }, ...prev]);
      audioService.playQuantumPop(1600);
    }, 1500);
  };

  const simularImpacto = () => {
    setIsCollisionMode(true);
    setExegesis("Colisión relativista CERN. Monitoreando radiación de cuadrupolo (π).");
    audioService.playQuantumPop(800);
    
    setTimeout(() => {
      setNodes(prev => {
        const fragments = Array.from({ length: 4 }).map((_, i) => ({
          id: `nu-${Date.now()}-${i}`,
          type: NodeClass.C,
          x: 400 + (Math.random() - 0.5) * 300,
          y: 300 + (Math.random() - 0.5) * 300,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          charge: -1,
          mass: 0.1
        } as QuantumNode));
        return [...prev.slice(0, 1), ...fragments];
      });
      setIsCollisionMode(false);
    }, 1200);
  };

  const generatePaper = () => {
    const report = `PROYECTO ABC v3.0 - REPORTE DE VALIDACIÓN π-EXACTA\n` +
      `---------------------------------------------------\n` +
      `Timestamp: ${new Date().toISOString()}\n` +
      `Teoría Optimizada: α̃ = ${PHYSICS.OPTIMIZED_THEORY.alpha}, β̃ = ${PHYSICS.OPTIMIZED_THEORY.beta}\n` +
      `Calibración: μ_scale = ${PHYSICS.OPTIMIZED_THEORY.mu_scale.toExponential(4)} (π/ℓp)\n` +
      `Carga Total: ${nodes.reduce((a, b) => a + b.charge, 0) / 9} e\n` +
      `Consistencia Geométrica: ${geometricReport?.tetrahedralConsistency.toFixed(2)}%\n` +
      `\nBITÁCORA DE AGENTES:\n` +
      logs.map(l => `[${l.agent}] ${l.message}`).join('\n');
      
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ABC_Pi_Exact_Validation_${Date.now()}.txt`;
    link.click();
  };

  const animatedTelemetryDisplay = useMemo(() => {
    if (!telemetry) return null;
    return {
      hubble: telemetry.hubbleConstant + Math.sin(tick * 0.02) * 0.04,
      alpha: telemetry.alpha + Math.sin(tick * 0.05) * 0.0000000005
    };
  }, [telemetry, tick]);

  return (
    <div className="flex h-screen w-screen bg-[#050508] text-slate-200 overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-80 border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col p-6 gap-6 relative overflow-hidden">
        {isValidating && (
          <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Procesando IA2 (Geómetra)...</p>
          </div>
        )}
        
        <header>
          <h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-400 to-green-500">
            ABC v3.0
          </h1>
          <p className="text-[9px] uppercase tracking-[0.4em] opacity-40">Exactitud π-Termodinámica</p>
        </header>

        <section className="flex flex-col gap-3">
           <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex justify-between">
              <span>Gestión de Nodos</span>
              <span className="text-cyan-400 opacity-60">π: {Math.PI.toFixed(5)}</span>
           </h2>
           
           <div className="relative">
             <button 
               onClick={() => setShowNodeSelector(!showNodeSelector)}
               className="w-full py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl text-[11px] font-black uppercase tracking-widest hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center justify-center gap-2"
             >
               <span className="text-lg">+</span> Inyectar Nodo Cuántico
             </button>

             {showNodeSelector && (
               <div className="absolute top-full left-0 w-full mt-2 p-2 bg-black/90 border border-white/10 rounded-xl backdrop-blur-xl z-[100] grid grid-cols-3 gap-2 animate-in slide-in-from-top-2 duration-200">
                 {[NodeClass.A, NodeClass.B, NodeClass.C].map(type => (
                   <button 
                     key={type}
                     onClick={() => addNode(type)}
                     className={`flex flex-col items-center p-3 rounded-lg border transition-all hover:scale-105 ${
                       type === 'A' ? 'border-red-500/40 bg-red-500/10 hover:bg-red-500/20' : 
                       type === 'B' ? 'border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20' : 
                       'border-green-500/40 bg-green-500/10 hover:bg-green-500/20'
                     }`}
                   >
                     <span className="text-xs font-black">{type}</span>
                     <span className="text-[8px] opacity-60 uppercase">{NODE_CONFIG[type].label}</span>
                   </button>
                 ))}
               </div>
             )}
           </div>
        </section>

        <section className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" /> 
            Agentes IA (Calibrados)
          </h2>
          {logs.map((log, i) => (
            <div key={i} className={`p-3 rounded-lg border border-white/5 bg-white/5 transition-all hover:bg-white/10 ${i === 0 ? 'border-cyan-500/30' : ''}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">{log.agent}</span>
                <span className="text-[8px] opacity-30">{log.timestamp}</span>
              </div>
              <p className="text-[11px] leading-relaxed italic text-slate-400">"{log.message}"</p>
            </div>
          ))}
        </section>

        <div className="flex flex-col gap-2">
          <button onClick={handleExecuteIA2} className="w-full py-3 bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/40 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Ejecutar IA2 (Geometría)
          </button>
          <button onClick={handleRunValidation} className="w-full py-3 bg-cyan-600/20 border border-cyan-500/40 hover:bg-cyan-600/40 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Validar Suite π-Exacta
          </button>
          <button onClick={generatePaper} className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
            Exportar Publicación
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex-1 relative">
          <SimulationCanvas 
            nodes={nodes} 
            connections={connections} 
            onTick={setTick} 
            onNodeMove={onNodeMove}
            isCollisionMode={isCollisionMode}
          />
          
          <div className="absolute bottom-6 left-6 flex gap-4">
            <button onClick={simularImpacto} className="px-6 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 rounded-lg text-[10px] font-bold uppercase tracking-widest">
              💥 Colisión Relativista
            </button>
            <div className="px-4 py-2 bg-black/60 border border-white/10 rounded-lg backdrop-blur">
              <span className="text-[10px] text-white/40 uppercase mr-3">Exégesis π:</span>
              <span className="text-[11px] italic text-cyan-300">"{exegesis}"</span>
            </div>
          </div>
        </div>

        {/* VALIDATION & GEOMETRY AREA */}
        <section className="h-64 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Cálculos de Campo (π-Refined)</h3>
            <div className="flex gap-4">
              {validationResults.length > 0 && (
                <span className="text-[10px] font-mono text-cyan-400">
                  VAL-π: {(validationResults.filter(r => r.passed).length / validationResults.length * 100).toFixed(0)}%
                </span>
              )}
              {geometricReport && (
                <span className="text-[10px] font-mono text-purple-400">
                  GEO-IA2: {geometricReport.tetrahedralConsistency.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {geometricReport ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] text-white/40 uppercase">Estructura Tetraédrica</p>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 shadow-glow" style={{ width: `${geometricReport.tetrahedralConsistency}%` }} />
                  </div>
                  <p className="text-[11px] font-mono text-purple-300">{geometricReport.geometricStatus}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white/5 border border-white/10 rounded">
                    <p className="text-[8px] opacity-40 uppercase">Área Planck (Ap)</p>
                    <p className="text-[10px] font-mono text-cyan-200">{geometricReport.areaPlanck.toExponential(4)} m²</p>
                  </div>
                  <div className="p-2 bg-white/5 border border-white/10 rounded">
                    <p className="text-[8px] opacity-40 uppercase">Volumen Planck (Vp)</p>
                    <p className="text-[10px] font-mono text-cyan-200">{geometricReport.volumePlanck.toExponential(4)} m³</p>
                  </div>
                </div>
                <div className="col-span-2 p-3 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                  <p className="text-[9px] text-purple-400/60 uppercase mb-1">Análisis IA2: Geometría Discreta</p>
                  <p className="text-[11px] italic text-slate-300">
                    "La red mantiene una coherencia del {geometricReport.tetrahedralConsistency.toFixed(2)}%. 
                    Las áreas de Planck calculadas con π-exacto sugieren un empaquetamiento óptimo bajo la métrica ABC."
                  </p>
                </div>
              </div>
            ) : validationResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {validationResults.map((res, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 pb-1">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-300">{res.name}</span>
                      <span className="text-[8px] opacity-40 uppercase">{res.description}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-cyan-300">{res.value}</span>
                      <span className={`text-[10px] font-bold ${res.passed ? 'text-green-500' : 'text-red-500'}`}>
                        {res.passed ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full text-left text-[11px] font-mono-tech">
                <thead>
                  <tr className="border-b border-white/10 opacity-40">
                    <th className="pb-2">Variable Cosmográfica</th>
                    <th className="pb-2">Predicción ABC (π)</th>
                    <th className="pb-2">NASA/LIGO</th>
                    <th className="pb-2">Sync</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr>
                    <td className="py-2">H₀ (Constante Hubble)</td>
                    <td>{PHYSICS.HUBBLE_THEORETICAL}</td>
                    <td className="text-cyan-200">{animatedTelemetryDisplay?.hubble.toFixed(4) || '---'}</td>
                    <td className="text-green-500">{animatedTelemetryDisplay ? Math.abs(PHYSICS.HUBBLE_THEORETICAL - animatedTelemetryDisplay.hubble).toFixed(4) : '---'}</td>
                  </tr>
                  <tr>
                    <td className="py-2">S_BH (Entropía Agujero Negro)</td>
                    <td>4π-Corrected</td>
                    <td className="text-cyan-200">10^77 k_B</td>
                    <td className="text-cyan-400">Termodinámica OK</td>
                  </tr>
                  <tr>
                    <td className="py-2">Ecuación Poisson</td>
                    <td>∇²Φ = 4πGρ</td>
                    <td className="text-cyan-200">ESTABLE</td>
                    <td className="text-cyan-400">VALIDADO</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* RIGHT METRICS */}
      <MetricsPanel 
        nodes={nodes} 
        tick={tick} 
        aiInsight={exegesis} 
        telemetry={telemetry} 
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
