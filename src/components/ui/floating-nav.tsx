import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MOBILE_BOTTOM_ITEMS } from "@/data/navItems";

export default function FloatingNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeId = MOBILE_BOTTOM_ITEMS.find((item) => item.isActive(location.pathname))?.id;

  return (
    // Desktop already has the full nav in the top navbar, so this stays mobile/tablet only.
    <div className="lg:hidden fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-sm pointer-events-none">
      <nav
        aria-label="Mobile Bottom Navigation"
        className="relative flex items-center bg-[#141414]/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.65)] rounded-full p-1 border border-white/10 pointer-events-auto select-none"
      >
        {MOBILE_BOTTOM_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex-1 flex flex-col items-center justify-center py-1.5 sm:py-2 px-1 rounded-full text-xs font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-xf-gold/50 ${
                isActive ? "text-xf-gold" : "text-white/50 hover:text-white/80 active:text-white/90"
              }`}
            >
              {/* Smooth sliding translucent active capsule */}
              {isActive && (
                <motion.div
                  layoutId="floatingNavActiveCapsule"
                  className="absolute inset-0 rounded-full bg-xf-gold/10 border border-xf-gold/25 shadow-[inset_0_1px_1px_rgba(242,185,11,0.25),0_2px_10px_rgba(0,0,0,0.35)]"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Content */}
              <span className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
                <Icon
                  size={19}
                  className={`transition-all duration-200 ${
                    isActive
                      ? "text-xf-gold scale-110 drop-shadow-[0_0_8px_rgba(242,185,11,0.4)]"
                      : "text-white/60"
                  }`}
                />
                <span
                  className={`text-[8.5px] sm:text-[9.5px] mt-0.5 tracking-tight uppercase whitespace-nowrap transition-all duration-200 ${
                    isActive ? "font-bold text-xf-gold tracking-normal" : "font-medium text-white/60"
                  }`}
                >
                  {item.label}
                </span>
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
