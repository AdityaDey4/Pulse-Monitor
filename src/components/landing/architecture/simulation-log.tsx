interface SimLogEntry {
  nodeId: string;
  color: string;
  message: string;
  time: string;
}

export function SimLog({ entries }: { entries: SimLogEntry[] }) {
  return (
    <div className="space-y-2">
      {entries.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-[11px] font-mono text-slate-700 text-center px-4">
          Press Run Simulation to watch data flow through the pipeline
        </div>
      ) : (
        entries.map((e, i) => (
          <div key={i} className="flex items-start gap-2 font-mono text-[11px]">
            <span className="text-slate-700 tabular-nums shrink-0">{e.time}</span>
            <span className="font-semibold shrink-0" style={{ color: e.color }}>
              [{e.nodeId}]
            </span>
            <span className="text-slate-400 leading-relaxed">{e.message}</span>
          </div>
        ))
      )}
    </div>
  );
}
