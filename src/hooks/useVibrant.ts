import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";

export interface Palette {
  vibrant: string | undefined;
  muted: string | undefined;
  darkVibrant: string | undefined;
  darkMuted: string | undefined;
  lightVibrant: string | undefined;
  lightMuted: string | undefined;
}

export function useVibrant(imageUrl: string) {
  const [colors, setColors] = useState<Palette | null>(null);

  useEffect(() => {
    async function run() {
      const palette = await Vibrant.from(imageUrl).getPalette();
      if (palette) {
        setColors({
          vibrant: palette.Vibrant?.hex,
          muted: palette.Muted?.hex,
          darkVibrant: palette.DarkVibrant?.hex,
          darkMuted: palette.DarkMuted?.hex,
          lightVibrant: palette.LightVibrant?.hex,
          lightMuted: palette.LightMuted?.hex,
        });
      }
    }
    run();
  }, [imageUrl]);

  return { colors };
}
