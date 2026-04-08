// Gamma filter that corrects the dark cover images coming from Beat Saber
// Source: https://github.com/ibillingsley/BeatSaber-Overlay/commit/bf4aa27ca3e125237c3803ac7bd69d8e28f770ec

export const GammaFilter = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <filter id="gamma" colorInterpolationFilters="sRGB">
        <feComponentTransfer>
          <feFuncR type="gamma" exponent={0.47} />
          <feFuncG type="gamma" exponent={0.47} />
          <feFuncB type="gamma" exponent={0.47} />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
);
