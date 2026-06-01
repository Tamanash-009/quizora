import { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Type, 
  Sliders,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

interface MemeGeneratorProps {
  initialScoreText?: string;
}

interface MemeTemplate {
  id: string;
  name: string;
  theme: 'tension' | 'success' | 'code' | 'fail';
  colorGradient: string[];
}

export default function MemeGenerator({ initialScoreText }: MemeGeneratorProps) {
  const [topText, setTopText] = useState(initialScoreText || 'STARING AT CODE');
  const [bottomText, setBottomText] = useState(initialScoreText ? 'NOTHING WORKS. ABSOLUTE L. 💀' : 'SLAYING THE LEADERBOARD IN 2 SECONDS');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [activeTemplate, setActiveTemplate] = useState<string>('tension_stress');
  const [exported, setExported] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const templates: MemeTemplate[] = [
    {
      id: 'tension_stress',
      name: 'NEET/JEE Pain 💀',
      theme: 'tension',
      colorGradient: ['#311042', '#cf1544']
    },
    {
      id: 'score_celebration',
      name: 'Unstoppable Flex 👑',
      theme: 'success',
      colorGradient: ['#1e1b4b', '#4f46e5', '#db2777']
    },
    {
      id: 'code_terminal',
      name: 'Terminal Guru 💻',
      theme: 'code',
      colorGradient: ['#020617', '#1e293b']
    },
    {
      id: 'timer_expired',
      name: 'Timer expired, bruh 🤡',
      theme: 'fail',
      colorGradient: ['#3b0712', '#7f1d1d']
    }
  ];

  // Draw templates
  useEffect(() => {
    drawMeme();
  }, [topText, bottomText, fontSize, fontColor, activeTemplate]);

  const drawMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Core Background gradient
    const matchedTemplate = templates.find(t => t.id === activeTemplate) || templates[0];
    const grad = ctx.createLinearGradient(0, 0, width, height);
    matchedTemplate.colorGradient.forEach((color, i) => {
      grad.addColorStop(i / (matchedTemplate.colorGradient.length - 1), color);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Add visual flare designs
    if (matchedTemplate.theme === 'tension') {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 5;
      for (let i = 0; i < width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 100, height);
        ctx.stroke();
      }
    } else if (matchedTemplate.theme === 'success') {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 140, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    } else if (matchedTemplate.theme === 'code') {
      ctx.fillStyle = '#22c55e';
      ctx.font = '12px Courier New, monospace';
      ctx.fillText('import { Slay } from "quizora-engine";', 25, 80);
      ctx.fillText('const user = Squad.getMember("Alice");', 25, 110);
      ctx.fillText('if (user.score === Quiz.maxScore) {', 25, 140);
      ctx.fillText('  user.setStatus("Demon Mode 🔥");', 25, 170);
      ctx.fillText('} else {', 25, 200);
      ctx.fillText('  throw new Error("L logic. No Cap.");', 25, 230);
      ctx.fillText('}', 25, 260);
    } else if (matchedTemplate.theme === 'fail') {
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#be123c';
      ctx.strokeRect(30, 30, width - 60, height - 60);
    }

    // 3. Render caption overlay
    ctx.fillStyle = fontColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = `900 ${fontSize}px "Space Grotesk", Impact, sans-serif`;

    // Multiline helper
    const renderCaption = (text: string, startY: number, lineSpacing: number, direction: 'top' | 'bottom') => {
      const words = text.split(' ');
      let line = '';
      const lines: string[] = [];

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width - 40 && i > 0) {
          lines.push(line);
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      let currentY = startY;
      if (direction === 'bottom') {
        currentY = startY - (lines.length - 1) * lineSpacing;
      }

      lines.forEach((l) => {
        ctx.strokeText(l, width / 2, currentY);
        ctx.fillText(l, width / 2, currentY);
        currentY += lineSpacing;
      });
    };

    // Draw Top Text
    renderCaption(topText, 25, fontSize + 4, 'top');

    // Draw Bottom Text
    ctx.textBaseline = 'bottom';
    renderCaption(bottomText, height - 25, fontSize + 4, 'bottom');
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const dlLink = document.createElement('a');
    dlLink.href = dataUrl;
    dlLink.download = `quizora-slay-meme-${Date.now()}.png`;
    document.body.appendChild(dlLink);
    dlLink.click();
    dlLink.remove();

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12 py-4">
      {/* Intro Header */}
      <div className="p-5 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000]">
        <span className="px-2.5 py-1 text-[9px] font-mono text-black bg-pink-500 border-2 border-black rounded uppercase font-black shadow-[1px_1px_0px_0px_#000]">
          MEME FORGE
        </span>
        <h1 className="text-2xl font-black text-white mt-1.5 uppercase tracking-tight">VIBE MEME CANVAS GENERATOR</h1>
        <p className="text-xs text-slate-350">Overlay spicy exam reactions, score achievements, and shareable high stakes instantly with the squad. No cap.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Settings Form Column */}
        <div className="md:col-span-6 p-6 rounded-2xl border-4 border-black bg-[#161e2e] space-y-5 shadow-[6px_6px_0px_0px_#000000]">
          
          {/* Preset templates selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-pink-500" /> 1. CHOOSE YOUR VIBE CARD
            </span>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTemplate(theme.id)}
                  className={`p-3 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-y-[1px] ${
                    activeTemplate === theme.id
                      ? 'bg-yellow-400 text-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-[#1f2a3d]'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-t-2 border-black" />

          {/* Top/Bottom Caption text input boxes */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-pink-500" /> 2. SET CAPTION TEXT
            </span>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-450 font-black pl-0.5">Top Overlay</label>
              <input
                type="text"
                placeholder="TOP OVERLAY CAPTION..."
                value={topText}
                onChange={(e) => setTopText(e.target.value.toUpperCase())}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-black bg-slate-800 text-xs font-black uppercase tracking-wide placeholder-slate-500 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-450 font-black pl-0.5">Bottom Overlay</label>
              <input
                type="text"
                placeholder="BOTTOM OVERLAY CAPTION..."
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value.toUpperCase())}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-black bg-slate-800 text-xs font-black uppercase tracking-wide placeholder-slate-500 text-white"
              />
            </div>
          </div>

          <hr className="border-t-2 border-black" />

          {/* Typography Layout variables */}
          <div className="space-y-3.5">
            <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-pink-505" /> 3. ADJUST SIZE & COLOURS
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-450 font-black pl-0.5">Font Size ({fontSize}px)</label>
                <input
                  type="range"
                  min="16"
                  max="38"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold flex items-center gap-1 justify-between">
                  <span>Font Colour</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-9 h-9 border-2 border-black cursor-pointer rounded-lg bg-transparent p-0"
                  />
                  <div className="flex gap-1.5">
                    {['#FFFFFF', '#FBBF24', '#34D399', '#F43F5E', '#22D3EE'].map((col) => (
                      <button
                        key={col}
                        onClick={() => setFontColor(col)}
                        className="w-4 h-4 rounded-full border border-black hover:scale-110 active:scale-90 transition-transform"
                        style={{ backgroundColor: col }}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={downloadMeme}
            className="w-full py-3.5 neo-btn text-xs font-black cursor-pointer"
          >
            <Download className="w-4 h-4 animate-bounce" />
            Forge Meme PNG 🖼️
          </button>

          {exported && (
            <div className="p-2 text-center rounded bg-emerald-950 text-emerald-450 border border-emerald-500 text-[10px] font-mono font-black animate-pulse uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> Flex item saved successfully!
            </div>
          )}
        </div>

        {/* Real-time Canvas column */}
        <div className="md:col-span-6 flex flex-col items-center space-y-3">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-black flex items-center gap-1 w-full justify-between pl-1">
            <span>CANVAS RENDER STREAM</span>
            <span className="text-yellow-450 text-yellow-500">[400 x 400 PX]</span>
          </span>

          <div className="p-4 rounded-2xl border-4 border-black bg-slate-900 shadow-[6px_6px_0px_0px_#000] overflow-hidden max-w-[420px] w-full aspect-square flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full h-full rounded-xl bg-slate-950 border-3 border-black shadow-inner"
            ></canvas>
          </div>

          <p className="text-[10px] text-slate-500 text-center max-w-sm leading-relaxed font-semibold">
            Synthesized locally with standard HTML5 canvas rendering context; absolute performance and 100% offline security.
          </p>
        </div>
      </div>
    </div>
  );
}
