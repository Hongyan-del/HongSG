
import React, { useState } from 'react';

interface EnergyRadarProps {
  balance: Record<string, number>;
}

const EnergyRadar: React.FC<EnergyRadarProps> = ({ balance }) => {
  const [hoveredEl, setHoveredEl] = useState<string | null>(null);
  
  const elements = ['木', '火', '土', '金', '水'];
  const elementColors: Record<string, string> = {
    '木': '#10b981', // emerald
    '火': '#f43f5e', // rose
    '土': '#b45309', // amber
    '金': '#cbd5e1', // slate
    '水': '#3b82f6'  // blue
  };

  const values = elements.map(el => balance[el] || 0);
  const maxVal = Math.max(...values, 600);
  const size = 300;
  const center = size / 2;
  const radius = center - 50;

  const points = elements.map((el, i) => {
    const angle = (Math.PI * 2 * i) / elements.length - Math.PI / 2;
    const value = ((balance[el] || 0) / maxVal) * radius;
    const x = center + Math.cos(angle) * value;
    const y = center + Math.sin(angle) * value;
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="relative w-full max-w-[320px] mx-auto group">
      {/* 互動數值浮窗 */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-stone-900/90 border border-yellow-900/40 px-3 py-1 rounded-sm text-xs transition-opacity duration-300 pointer-events-none z-10 ${hoveredEl ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-yellow-600 font-bold">{hoveredEl}</span> 能量值: <span className="text-white">{hoveredEl ? balance[hoveredEl] : 0}</span>
      </div>

      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        {/* 背景太極陰影 */}
        <circle cx={center} cy={center} r={radius * 0.15} fill="rgba(133, 77, 14, 0.05)" />
        <path 
          d={`M ${center} ${center - radius * 0.15} A ${radius * 0.075} ${radius * 0.075} 0 0 1 ${center} ${center} A ${radius * 0.075} ${radius * 0.075} 0 0 0 ${center} ${center + radius * 0.15} A ${radius * 0.15} ${radius * 0.15} 0 0 0 ${center} ${center - radius * 0.15}`} 
          fill="rgba(133, 77, 14, 0.15)"
        />

        {/* 背景網格 (五角形) */}
        {gridLevels.map((lvl, idx) => (
          <polygon
            key={idx}
            points={elements.map((_, i) => {
              const angle = (Math.PI * 2 * i) / elements.length - Math.PI / 2;
              const r = radius * lvl;
              return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(133, 77, 14, 0.15)"
            strokeWidth="0.5"
            strokeDasharray={idx === gridLevels.length - 1 ? "none" : "2 2"}
          />
        ))}

        {/* 軸線 (連向頂點) */}
        {elements.map((el, i) => {
          const angle = (Math.PI * 2 * i) / elements.length - Math.PI / 2;
          const targetX = center + Math.cos(angle) * radius;
          const targetY = center + Math.sin(angle) * radius;
          return (
            <g key={i}>
              <line
                x1={center}
                y1={center}
                x2={targetX}
                y2={targetY}
                stroke="rgba(133, 77, 14, 0.1)"
                strokeWidth="1"
              />
              {/* 頂點標記裝飾 */}
              <circle 
                cx={targetX} 
                cy={targetY} 
                r="3" 
                fill={elementColors[el]} 
                className="opacity-40"
              />
            </g>
          );
        })}

        {/* 數據多邊形 (動態效果) */}
        <path
          d={`M ${points.split(' ')[0]} ${points.split(' ').slice(1).map(p => 'L ' + p).join(' ')} Z`}
          fill="rgba(202, 138, 4, 0.15)"
          stroke="#ca8a04"
          strokeWidth="2"
          className="transition-all duration-700 ease-out"
        />

        {/* 互動式透明觸控區與標籤 */}
        {elements.map((el, i) => {
          const angle = (Math.PI * 2 * i) / elements.length - Math.PI / 2;
          const labelR = radius + 25;
          const x = center + Math.cos(angle) * labelR;
          const y = center + Math.sin(angle) * labelR;
          
          const valueR = ((balance[el] || 0) / maxVal) * radius;
          const vx = center + Math.cos(angle) * valueR;
          const vy = center + Math.sin(angle) * valueR;

          return (
            <g 
              key={el} 
              onMouseEnter={() => setHoveredEl(el)}
              onMouseLeave={() => setHoveredEl(null)}
              className="cursor-help"
            >
              {/* 標籤文字 */}
              <text
                x={x}
                y={y}
                fill={hoveredEl === el ? elementColors[el] : "#854d0e"}
                fontSize="16"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="middle"
                className="transition-colors duration-300 select-none"
              >
                {el}
              </text>
              
              {/* 數據點發光效果 */}
              <circle 
                cx={vx} 
                cy={vy} 
                r={hoveredEl === el ? "6" : "4"} 
                fill={elementColors[el]}
                className="transition-all duration-300"
              />
              {hoveredEl === el && (
                <circle 
                  cx={vx} 
                  cy={vy} 
                  r="12" 
                  fill={elementColors[el]} 
                  className="opacity-20 animate-ping"
                />
              )}

              {/* 透明觸控區 */}
              <circle 
                cx={x} 
                cy={y} 
                r="30" 
                fill="transparent" 
              />
            </g>
          );
        })}
      </svg>
      
      {/* 底部圖例 */}
      <div className="flex justify-between mt-2 px-4">
        {elements.map(el => (
          <div key={el} className="flex flex-col items-center gap-1">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: elementColors[el] }}></div>
             <span className="text-[10px] text-stone-500 font-bold">{el}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnergyRadar;
