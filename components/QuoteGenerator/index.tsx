import { useEffect, useState } from "react";

// Material UI Imports
import { Backdrop, Fade, Modal } from "@mui/material";
import {
  ModalCircularProgress,
  QuoteGeneratorCon,
  QuoteGeneratorModalCon,
  QuoteGeneratorModalInnerCon,
  QuoteGeneratorSubTitle,
  QuoteGeneratorTitle,
} from "./QuoteGeneratorElements";
import { ImageBlobCon } from "../animations/AnimationElements";
import AnimatedDownloadButton from "../animations/AnimatedDownloadButton";
import ImageBlob from "../animations/ImageBlob";

interface QuoteGeneratorModalProps {
  open: boolean;
  close: () => void;
  processingQuote: boolean;
  setProcessingQuote: React.Dispatch<React.SetStateAction<boolean>>;
  quoteReceived: String | null;
  setQuoteReceived: React.Dispatch<React.SetStateAction<String | null>>;
}

export const QuoteGeneratorModal = ({
  open,
  close,
  processingQuote,
  setProcessingQuote,
  quoteReceived,
  setQuoteReceived,
}: QuoteGeneratorModalProps) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Handling download of quote card
  const handleDownload = () => {};

  // Handle the receiving of quote card
  useEffect(() => {
    if (quoteReceived) {
      const binaryData = Buffer.from(quoteReceived, "base64");
      const blob = new Blob([binaryData], { type: "image/png" });
      const blobUrlGenerated = URL.createObjectURL(blob);
      setBlobUrl(blobUrlGenerated);

      return () => {
        URL.revokeObjectURL(blobUrlGenerated);
      };
    }
  }, [quoteReceived]);

  return (
    <Modal
      id="QuoteGeneratorModal"
      aria-labelledby="spring-modal-quotegeneratormodal"
      aria-describedby="spring-modal-opens-and-closes-quote-generator"
      open={open}
      onClose={close}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <QuoteGeneratorModalCon>
          <QuoteGeneratorModalInnerCon>
            {/* State #1: Processing request of quote + quote state is empty */}
            {processingQuote && quoteReceived === null && (
              <>
                <ModalCircularProgress size={"8rem"} thickness={2.5} />
                <QuoteGeneratorTitle>
                  Creating your quote...
                </QuoteGeneratorTitle>
              </>
            )}

            {/* State #2: Quote state fulfilled */}
            {quoteReceived !== null && (
              <>
                <QuoteGeneratorTitle>Download your quote!</QuoteGeneratorTitle>
                <QuoteGeneratorSubTitle style={{ marginTop: "20px" }}>
                  See a preview:
                </QuoteGeneratorSubTitle>
                <ImageBlobCon>
                  <ImageBlob quoteReceived={quoteReceived} blobUrl={blobUrl} />
                </ImageBlobCon>
                <AnimatedDownloadButton handleDownload={handleDownload} />
              </>
            )}
          </QuoteGeneratorModalInnerCon>
        </QuoteGeneratorModalCon>
      </Fade>
    </Modal>
  );
  return <div></div>;
};
