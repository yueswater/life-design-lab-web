import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';

interface ImageCropModalProps {
  file: File;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

const MIN_BOX = 60;
const MAX_OUTPUT_DIMENSION = 1600;

type Handle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

const HANDLES: { id: Handle; cursor: string }[] = [
  { id: 'nw', cursor: 'nwse-resize' },
  { id: 'ne', cursor: 'nesw-resize' },
  { id: 'sw', cursor: 'nesw-resize' },
  { id: 'se', cursor: 'nwse-resize' },
  { id: 'n', cursor: 'ns-resize' },
  { id: 's', cursor: 'ns-resize' },
  { id: 'e', cursor: 'ew-resize' },
  { id: 'w', cursor: 'ew-resize' },
];

// Shows the whole image at its own natural aspect ratio (never stretched
// into a fixed viewport), with a freeform crop box overlaid on top. Drag
// inside the box to move it; drag a corner to resize both dimensions, or an
// edge to resize just width or height — same interaction as Canva's
// freeform crop, width and height are always independent. Export crops
// straight from the source image via canvas drawImage's source-rect, at the
// box's own aspect ratio (capped to a sane max resolution).
export const ImageCropModal: React.FC<ImageCropModalProps> = ({ file, onCancel, onConfirm }) => {
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const displayImgRef = useRef<HTMLImageElement>(null);
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const dragState = useRef<
    | { mode: 'move'; startX: number; startY: number; boxX: number; boxY: number }
    | { mode: 'resize'; handle: Handle; anchorX: number; anchorY: number }
    | null
  >(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setImgEl(img);
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Measure the *actual rendered* <img> box directly — deriving height from
  // naturalHeight/naturalWidth * displayW looks equivalent on paper, but any
  // rounding or layout quirk between the two makes the crop box drift off
  // the real image edges. Reading the live box is the only way to guarantee
  // they always match.
  useLayoutEffect(() => {
    const el = displayImgRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setDisplaySize({ w: rect.width, h: rect.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [imgEl]);

  const displayW = displaySize.w;
  const displayH = displaySize.h;

  // Initial box: 80% of the image, centered.
  useEffect(() => {
    if (!imgEl || displayW === 0 || displayH === 0) return;
    const w = displayW * 0.8;
    const h = displayH * 0.8;
    setBox({ x: (displayW - w) / 2, y: (displayH - h) / 2, w, h });
  }, [imgEl, displayW, displayH]);

  if (!imgEl) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4">
        <div
          ref={containerRef}
          className="w-full max-w-xl rounded-2xl bg-white px-6 py-5 text-sm font-semibold text-slate-500"
        >
          載入圖片中...
        </div>
      </div>
    );
  }

  const startMove = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { mode: 'move', startX: e.clientX, startY: e.clientY, boxX: box.x, boxY: box.y };
  };

  const startResize = (handle: Handle) => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const anchorX = handle.includes('w') ? box.x + box.w : box.x;
    const anchorY = handle.includes('n') ? box.y + box.h : box.y;
    dragState.current = { mode: 'resize', handle, anchorX, anchorY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragState.current;
    if (!drag) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (drag.mode === 'move') {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const x = Math.min(Math.max(drag.boxX + dx, 0), displayW - box.w);
      const y = Math.min(Math.max(drag.boxY + dy, 0), displayH - box.h);
      setBox((prev) => ({ ...prev, x, y }));
      return;
    }

    const { handle, anchorX, anchorY } = drag;
    const mouseX = Math.min(Math.max(e.clientX - rect.left, 0), displayW);
    const mouseY = Math.min(Math.max(e.clientY - rect.top, 0), displayH);
    const affectsX = handle !== 'n' && handle !== 's';
    const affectsY = handle !== 'e' && handle !== 'w';
    const leftSide = handle.includes('w');
    const topSide = handle.includes('n');

    let w = box.w;
    let h = box.h;
    let x = box.x;
    let y = box.y;

    if (affectsX) {
      w = Math.max(Math.abs(mouseX - anchorX), MIN_BOX);
      const maxW = leftSide ? anchorX : displayW - anchorX;
      w = Math.min(w, maxW);
      x = leftSide ? anchorX - w : anchorX;
    }
    if (affectsY) {
      h = Math.max(Math.abs(mouseY - anchorY), MIN_BOX);
      const maxH = topSide ? anchorY : displayH - anchorY;
      h = Math.min(h, maxH);
      y = topSide ? anchorY - h : anchorY;
    }

    setBox({ x, y, w, h });
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const handleConfirm = () => {
    const scale = imgEl.naturalWidth / displayW;
    const sourceX = box.x * scale;
    const sourceY = box.y * scale;
    const sourceW = box.w * scale;
    const sourceH = box.h * scale;

    const outputScale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(sourceW, sourceH));
    const outputW = Math.round(sourceW * outputScale);
    const outputH = Math.round(sourceH * outputScale);

    const canvas = document.createElement('canvas');
    canvas.width = outputW;
    canvas.height = outputH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(imgEl, sourceX, sourceY, sourceW, sourceH, 0, 0, outputW, outputH);
    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      'image/jpeg',
      0.92
    );
  };

  const handleStyle = (id: Handle): React.CSSProperties => {
    switch (id) {
      case 'nw':
        return { left: box.x, top: box.y };
      case 'ne':
        return { left: box.x + box.w, top: box.y };
      case 'sw':
        return { left: box.x, top: box.y + box.h };
      case 'se':
        return { left: box.x + box.w, top: box.y + box.h };
      case 'n':
        return { left: box.x + box.w / 2, top: box.y };
      case 's':
        return { left: box.x + box.w / 2, top: box.y + box.h };
      case 'w':
        return { left: box.x, top: box.y + box.h / 2 };
      case 'e':
        return { left: box.x + box.w, top: box.y + box.h / 2 };
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#023047]">裁切圖片</h2>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative mx-auto select-none"
          style={{ width: '100%' }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <img
            ref={displayImgRef}
            src={imgEl.src}
            alt=""
            draggable={false}
            className="block w-full select-none"
          />

          {/* Dimmed mask outside the crop box, built from 4 rectangles so the
              box itself stays fully clear (no overlay blocking the view). */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute bg-black/50" style={{ left: 0, top: 0, width: '100%', height: box.y }} />
            <div
              className="absolute bg-black/50"
              style={{ left: 0, top: box.y + box.h, width: '100%', height: displayH - box.y - box.h }}
            />
            <div className="absolute bg-black/50" style={{ left: 0, top: box.y, width: box.x, height: box.h }} />
            <div
              className="absolute bg-black/50"
              style={{ left: box.x + box.w, top: box.y, width: displayW - box.x - box.w, height: box.h }}
            />
          </div>

          <div
            onPointerDown={startMove}
            className="absolute touch-none cursor-move border-2 border-[#FBD634]"
            style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
          />

          {HANDLES.map((h) => (
            <div
              key={h.id}
              onPointerDown={startResize(h.id)}
              className="absolute h-4 w-4 touch-none rounded-full border-2 border-[#FBD634] bg-white shadow"
              style={{ ...handleStyle(h.id), marginLeft: -8, marginTop: -8, cursor: h.cursor }}
            />
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          拖曳裁切框調整位置，拖曳邊角調整大小，拖曳邊線可單獨調整寬或高
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#FBD634] py-2.5 text-sm font-bold text-[#023047] hover:brightness-95 cursor-pointer"
          >
            <Check className="h-4 w-4" />
            確認裁切
          </button>
        </div>
      </div>
    </div>
  );
};
