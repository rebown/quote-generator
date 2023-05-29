import {
  BackgroundImage1,
  BackgroundImage2,
  FooterCon,
  GradientBackgroundCon,
} from "@/components/QuoteGenerator/QuoteGeneratorElements";
import Cloud1 from "@/assets/cloudy-weather.png";
import Cloud2 from "@/assets/cloud-and-thunder.png";
import { useState } from "react";

export default function Home() {
  const [numOfQuotes, setNumOfQuotes] = useState<Number | null>(0);

  return (
    <>
      <GradientBackgroundCon>
        <BackgroundImage1 src={Cloud1} height="300" alt="img 1" />
        <BackgroundImage2 src={Cloud2} height="300" alt="img 2" />

        <FooterCon>
          <>Quotes Generated: {numOfQuotes}</>
        </FooterCon>
      </GradientBackgroundCon>
    </>
  );
}
