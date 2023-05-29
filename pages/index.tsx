import {
  BackgroundImage1,
  BackgroundImage2,
  GradientBackgroundCon,
} from "@/components/QuoteGenerator/QuoteGeneratorElements";
import Cloud1 from "@/assets/cloudy-weather.png";
import Cloud2 from "@/assets/cloud-and-thunder.png";

export default function Home() {
  return (
    <>
      <GradientBackgroundCon>
        <BackgroundImage1 src={Cloud1} height="300" alt="img 1" />
        <BackgroundImage2 src={Cloud2} height="300" alt="img 2" />
      </GradientBackgroundCon>
    </>
  );
}
