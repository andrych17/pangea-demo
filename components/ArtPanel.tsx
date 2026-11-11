import { Icon, type IconName } from "./Icon";

/**
 * Photo stand-in drawn from the theme colours, so every sector preset looks finished before real photos exist.
 * Four compositions, picked by `variant`. Fills its parent (give the parent a size and `relative`).
 * `bare` drops the centred icon (use it behind text, e.g. ClipReveal).
 */
export function ArtPanel({ icon, label, variant = 0, bare, className }: { icon: IconName; label?: string; variant?: number; bare?: boolean; className?: string }) {
  const v = ((variant % 4) + 4) % 4;
  return (
    <div className={`absolute inset-0 overflow-hidden ${BG[v]} ${className ?? ""}`} role="img" aria-label={label ?? ""}>
      {v === 0 && (
        <>
          <div className="absolute -right-[18%] -top-[22%] aspect-square w-[78%] rounded-full bg-accent" />
          <div className="absolute -bottom-[30%] -left-[10%] aspect-square w-[70%] rounded-full border-[18px] border-accent-2/80" />
        </>
      )}
      {v === 1 && (
        <>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_22px,rgba(255,255,255,0.06)_22px_44px)]" />
          <div className="absolute bottom-0 left-0 h-[46%] w-full bg-accent-3" />
          <div className="absolute bottom-[34%] right-[12%] aspect-square w-[34%] rounded-full bg-accent-2" />
        </>
      )}
      {v === 2 && (
        <>
          <div className="absolute left-[8%] top-[8%] h-[58%] w-[56%] rounded-[2rem] bg-canvas/90" />
          <div className="absolute bottom-[8%] right-[8%] h-[46%] w-[48%] rounded-[2rem] bg-accent" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1.5px)] [background-size:18px_18px]" />
        </>
      )}
      {v === 3 && (
        <>
          <div className="absolute inset-x-0 top-[18%] h-[22%] bg-accent-2" />
          <div className="absolute inset-x-0 top-[48%] h-[10%] bg-accent" />
          <div className="absolute -bottom-[25%] left-1/2 aspect-square w-[90%] -translate-x-1/2 rounded-full bg-deep-2" />
        </>
      )}
      {!bare && (
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid aspect-square w-[32%] max-w-40 place-items-center rounded-full bg-canvas/95 text-ink shadow-[0_24px_50px_-20px_rgba(0,0,0,0.5)]">
          <Icon name={icon} size={56} weight="duotone" className="h-1/2 w-1/2" />
        </span>
      </div>
      )}
    </div>
  );
}

const BG = ["bg-deep", "bg-deep-2", "bg-accent-3", "bg-canvas-2"];
