/* Amplify Params - DO NOT EDIT
	API_QUOTEGENERATOR_GRAPHQLAPIIDOUTPUT
	API_QUOTEGENERATOR_QUOTEAPPDATATABLE_ARN
	API_QUOTEGENERATOR_QUOTEAPPDATATABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

//AWS packages
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

//Image generation packages
const sharp = require("sharp");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

// Function update DynamoDB table
async function updateQuoteDDBObject() {
  const quoteTableName = process.env.API_QUOTEGENERATOR_QUOTEAPPDATATABLE_NAME;
  const quoteObjectID = "321231-321321231-32213123";

  try {
    const params = {
      TableName: quoteTableName,
      Key: {
        "id": quoteObjectID,
      },
      UpdateExpression: "SET #quotesGenerated = #quotesGenerated + :inc",
      ExpressionAttributeValues: {
        ":inc": 1,
      },
      ExpressionAttributeNames: {
        "#quotesGenerated": "quotesGenerated",
      },
      ReturnValues: "UPDATED_NEW",
    };

    const updateQuoteObject = await docClient.update(params).promise();
    return updateQuoteObject;
  } catch (error) {
    console.log("Error updating an obejct in DynamoDB");
  }
}

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const quotesURL = "https://zenquotes.io/api/random";

  async function getRandomQuote(url) {
    let quoteAuthor;
    let quoteText;

    const response = await fetch(url);
    const data = await response.json();

    // quote elements
    quoteAuthor = data[0].a;
    quoteText = data[0].q;

    // Image construction
    const width = 750;
    const height = 483;
    const lineBrake = 4;
    const quoteWords = quoteText.split(" ");
    let newТеxt = "";

    // Define some tspanElements w/ 4 words each
    let tspanElements = "";
    for (let i = 0; i < quoteWords.length; i++) {
      newТеxt += quoteWords[i] + " ";
      if ((i + 1) % lineBrake === 0) {
        tspanElements += `<tspan x="${
          width / 2
        }" dy="1.2em">${newТеxt}</tspan>`;
        newТеxt = "";
      }
    }

    if (newТеxt !== "") {
      tspanElements += `<tspan x="${width / 2}" dy="1.2em">${newТеxt}</tspan>`;
    }

    // Construct the SVG
    const svgElement = `<svg  width="${width}" height="${height}">
    <style>
      .title {
        fill: #ffffff;
        font-size: 20px;
        font-weight: bold;
      }
      .quoteAuthor {
        font-size: 35px;
         font-weight: bold;
         padding: 50px;
      }
      .footer {
        font-size: 20px;
         font-weight: bold;
         fill: lightgrey;
         text-anchor: middle;
         font-family="Arial, sans-serif"
      }
    </style>
    <circle cx="382" cy="76" r="44" fill="rgba(255, 255, 255, 0.155)" />
    <text x="382" y="76" dy="50" text-anchor="middle" font-size="90" font-family="Arial, sans-serif" fill="white">Hello, SVG!</text>
    <g>
      <rect x="0" y="0" width="${width}" height="auto"></rect>
      <text id="lastLineOfQuote" x="375" y="120" font-size="35" font-family="Arial, sans-serif" text-anchor="middle" fill="white">
      ${tspanElements}
      <tspan class="quoteAuthor" x="375" dy="1.8em">${quoteAuthor}</tspan>
      </text>
    </g>
    </svg>`;

    const backgroundImages = [
      "backgrounds/Aubergine.png",
      "backgrounds/Mantle.png",
      "backgrounds/Orangey.png",
    ];

    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const selectedImage = backgroundImages[randomIndex];

    // Composite this image together
    const svgBuffer = Buffer.from(svgElement);
    const imagePath = path.join("/tmp", "quote-card.png");
    const image = await sharp(selectedImage)
      .composite([
        {
          input: svgBuffer,
          top: 0,
          left: 0,
        },
      ])
      .toFile(imagePath);

    // Update DynamoDB object in table
    try {
      updateQuoteDDBObject();
    } catch (error) {
      console.log("Error while updating DynamoDB");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Headers": "*",
      },
      body: fs.readFileSync(imagePath).toString("base64"),
      isBase64Encoded: true,
    };
  }

  return await getRandomQuote(quotesURL);
};
