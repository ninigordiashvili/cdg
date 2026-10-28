// SVG colour-matrix filters used by the colour-adaptation modes (see globals.css).
export default function ColorFilters() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <filter id="a11y-protanopia" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="1.000 0.000 0.000 0 0 -0.255 1.255 0.000 0 0 0.303 -0.545 1.242 0 0 0 0 0 1 0"
        />
      </filter>
      <filter id="a11y-deuteranopia" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="1.000 0.000 0.000 0 0 -0.438 1.438 0.000 0 0 0.262 -0.562 1.300 0 0 0 0 0 1 0"
        />
      </filter>
      <filter id="a11y-tritanopia" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="1.050 -0.382 0.332 0 0 0.000 1.234 -0.234 0 0 0.000 0.000 1.000 0 0 0 0 0 1 0"
        />
      </filter>
    </svg>
  );
}
