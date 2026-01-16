
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { QuantumNode, Connection, NodeClass } from '../types';
import { NODE_CONFIG, PHYSICS } from '../constants';

interface SimulationCanvasProps {
  nodes: QuantumNode[];
  connections: Connection[];
  onTick: (tick: number) => void;
  onNodeMove: (id: string, x: number, y: number) => void;
  isCollisionMode: boolean;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ 
  nodes, 
  connections, 
  onTick, 
  onNodeMove,
  isCollisionMode
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const applyTetrahedralConstraint = (ctx: CanvasRenderingContext2D) => {
    // Visual cue for geometry discrete
    ctx.setLineDash([2, 5]);
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.beginPath();
    for (let i = 0; i < ctx.canvas.width; i += 60) {
      ctx.moveTo(i, 0); ctx.lineTo(i, ctx.canvas.height);
    }
    for (let i = 0; i < ctx.canvas.height; i += 60) {
      ctx.moveTo(0, i); ctx.lineTo(ctx.canvas.width, i);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    applyTetrahedralConstraint(ctx);

    // Connections with Dynamic Tension
    connections.forEach(conn => {
      const s = nodes.find(n => n.id === conn.sourceId);
      const t = nodes.find(n => n.id === conn.targetId);
      if (s && t) {
        const d = Math.sqrt(Math.pow(s.x - t.x, 2) + Math.pow(s.y - t.y, 2));
        const tension = Math.min(d / PHYSICS.CONNECTION_DISTANCE, 2.5);
        ctx.beginPath();
        ctx.lineWidth = 1 + tension;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + tension * 0.2})`;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
        
        if (tension > 1.8) {
          ctx.fillStyle = '#ffaa44';
          ctx.font = '8px mono';
          ctx.fillText("TENSIÓN RED", (s.x+t.x)/2, (s.y+t.y)/2 - 10);
        }
      }
    });

    // Nodes
    nodes.forEach(node => {
      const config = NODE_CONFIG[node.type];
      const radius = PHYSICS.NODE_RADIUS[node.type];
      
      // Time Dilation Effect
      if (node.id === draggedId) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '10px sans-serif';
        ctx.fillText("Δt Dilatación", node.x + 20, node.y - 20);
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = config.color;
      ctx.fill();
      
      // Core Glow
      const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2.5);
      g.addColorStop(0, `${config.color}55`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    if (isCollisionMode) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }, [nodes, connections, draggedId, isCollisionMode]);

  useEffect(() => {
    let frame = 0;
    const loop = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) draw(ctx);
      onTick(frame++);
      requestAnimationFrame(loop);
    };
    const anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [draw, onTick]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const target = nodes.find(n => Math.sqrt(Math.pow(n.x - x, 2) + Math.pow(n.y - y, 2)) < 25);
    if (target) setDraggedId(target.id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedId) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      onNodeMove(draggedId, e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseUp = () => setDraggedId(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (c) {
      c.width = c.parentElement?.clientWidth || 800;
      c.height = c.parentElement?.clientHeight || 600;
    }
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="w-full h-full bg-[#050508] rounded-xl border border-white/10 cursor-crosshair"
    />
  );
};
