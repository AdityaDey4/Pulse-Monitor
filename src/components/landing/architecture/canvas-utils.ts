import { EDGES, NODES } from "./architecture-data";

type NodeStatus = "idle" | "active" | "done";
export function drawEdges(
  canvas: HTMLCanvasElement,
  statuses: Record<string, NodeStatus>,
  scaleX: number,
  scaleY: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);

  EDGES.forEach(({ from, to }) => {
    const fNode = NODES.find((n) => n.id === from)!;
    const tNode = NODES.find((n) => n.id === to)!;

    const fx = fNode.cx * scaleX;
    const fy = fNode.cy * scaleY;
    const tx = tNode.cx * scaleX;
    const ty = tNode.cy * scaleY;

    const fromLit = statuses[from] === "done" || statuses[from] === "active";
    const toLit = statuses[to] === "done" || statuses[to] === "active";
    const lit = fromLit && toLit;

    ctx.strokeStyle = lit ? "rgba(0,212,255,0.6)" : "rgba(255,255,255,0.08)";
    ctx.shadowColor = lit ? "#00D4FF" : "transparent";
    ctx.shadowBlur = lit ? 8 : 0;

    const cpx = (fx + tx) / 2;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.bezierCurveTo(cpx, fy, cpx, ty, tx, ty);
    ctx.stroke();

    if (lit) {
      const angle = Math.atan2(ty - fy, tx - fx);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(0,212,255,0.85)";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(
        tx - 10 * Math.cos(angle - 0.4),
        ty - 10 * Math.sin(angle - 0.4),
      );
      ctx.lineTo(
        tx - 10 * Math.cos(angle + 0.4),
        ty - 10 * Math.sin(angle + 0.4),
      );
      ctx.closePath();
      ctx.fill();
      ctx.setLineDash([5, 5]);
    }

    ctx.shadowBlur = 0;
  });

  ctx.setLineDash([]);
}