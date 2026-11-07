import {loadFont} from "@remotion/fonts";
import {Composition, staticFile} from "remotion";
import {REFRESHED_FPS, REFRESHED_FRAMES, Refreshed} from "./Refreshed";

loadFont({family: "Inter", url: staticFile("fonts/inter.woff2"), weight: "100 900"});

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Refreshed" component={Refreshed} durationInFrames={REFRESHED_FRAMES} fps={REFRESHED_FPS} width={1920} height={1080} />
  </>
);
