import React, { useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";
// import styles from "@/styles/Home.module.css";

// Components
import {
  BackgroundImage1,
  BackgroundImage2,
  FooterCon,
  FooterLink,
  GenerateQuoteButton,
  GenerateQuoteButtonText,
  GradientBackgroundCon,
  QuoteGeneratorCon,
  QuoteGeneratorInnerCon,
  QuoteGeneratorSubTitle,
  QuoteGeneratorTitle,
  RedSpan,
} from "@/components/QuoteGenerator/QuoteGeneratorElements";
import { QuoteGeneratorModal } from "@/components/QuoteGenerator";
// Assets
import Clouds1 from "../assets/cloud-and-thunder.png";
import Clouds2 from "../assets/cloudy-weather.png";
import { API } from "aws-amplify";
import { generateAQuote, quotesQueryName } from "@/src/graphql/queries";
import { GraphQLResult } from "@aws-amplify/api-graphql";

// interface for our appsync <> lambda JSON response
interface GenerateAQuoteData {
  generateAQuote: {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
  };
}

//interface for DynamoDB object
interface UpdateQuoteInfoData {
  id: string;
  queryName: string;
  quotesGenerated: number;
  createdAt: string;
  updatedAt: string;
}

//type guard for our fetch function
function isGraphQLResultForquotesQueryName(
  response: any
): response is GraphQLResult<{
  quotesQueryName: {
    items: [UpdateQuoteInfoData];
  };
}> {
  return (
    response.data &&
    response.data.quotesQueryName &&
    response.data.quotesQueryName.items
  );
}

export default function Home() {
  const [numOfQuotes, setNumOfQuotes] = useState<Number | null>(0);
  const [openGenerator, setOpenGenerator] = useState(false);
  const [processingQuote, setProcessingQuote] = useState(false);
  const [quoteReceived, setQuoteReceived] = useState<String | null>(null);

  const updateQuoteInfo = async () => {
    try {
      const response = await API.graphql<UpdateQuoteInfoData>({
        query: quotesQueryName,
        authMode: "AWS_IAM",
        variables: {
          queryName: "LIVE",
        },
      });

      //create type guard
      if (!isGraphQLResultForquotesQueryName(response)) {
        throw new Error("Unexpected response from API.graphql");
      }
      //check response.data
      if (!response.data) {
        throw new Error("Response data is undefined");
      }
      //set number of quotes
      const receivedNumberOfQuotes =
        response.data.quotesQueryName.items[0].quotesGenerated;
      setNumOfQuotes(receivedNumberOfQuotes);

      console.log(response);
    } catch (error) {
      console.log("Error getting quote data");
    }
  };

  useEffect(() => {
    updateQuoteInfo();
  }, []);

  //function for quote generator modal
  const handleCloseGenerator = () => {
    setOpenGenerator(false);
    setProcessingQuote(false);
    setQuoteReceived(null);
  };

  const handleOpenGenerator = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpenGenerator(true);
    setProcessingQuote(true);
  };

  return (
    <>
      <Head>
        <title>Inspirational Quote Generator</title>
        <meta name="description" content="A fun project to generate quotes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GradientBackgroundCon>
        <QuoteGeneratorModal
          open={openGenerator}
          close={handleCloseGenerator}
          processingQuote={processingQuote}
          setProcessingQuote={setProcessingQuote}
          quoteReceived={quoteReceived}
          setQuoteReceived={setQuoteReceived}
        />

        <BackgroundImage1 src={Clouds1} height="300" alt="img 1" />
        <BackgroundImage2 src={Clouds2} height="300" alt="img 2" />

        <QuoteGeneratorCon>
          <QuoteGeneratorInnerCon>
            <QuoteGeneratorTitle>Inspiration GEnerator</QuoteGeneratorTitle>
            <QuoteGeneratorSubTitle></QuoteGeneratorSubTitle>

            <GenerateQuoteButton onClick={handleOpenGenerator}>
              <GenerateQuoteButtonText>Make a Quote</GenerateQuoteButtonText>
            </GenerateQuoteButton>
          </QuoteGeneratorInnerCon>
        </QuoteGeneratorCon>

        <FooterCon>
          <>Quotes Generated: {numOfQuotes}</>
        </FooterCon>
      </GradientBackgroundCon>
    </>
  );
}
