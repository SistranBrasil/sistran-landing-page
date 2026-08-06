import "./index.css";
import { Composition } from "remotion";
import { SistranHero } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SistranHero"
      component={SistranHero}
      durationInFrames={1080}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
