# Hi-Lo Card Game

An Alexa skill for playing a game of high card by suit.

## Description

A simple game of high card. Two cards are drawn from a shuffled deck for each game. Alexa will tell you the first card. Will the second card be higher or lower than the first?

Ranks are ordered two through 10 then jack, queen, king, and ace. Suits are ordered in ascending alphabetical order: clubs, diamonds, hearts, and spades.

### Example phrases

- Alexa, start Hi Lo
- Deal
- Higher

## Development

This skill runs on AWS Lambda and doesn't have any storage requirements.

### Requirements

- Node 6.10 (AWS Lambda instance version)

### On-boarding

In the root of the project:

```
npm install
npm start
```

Then visit [the simulator](http://localhost:8080/alexa/hilocardgame) to play around.

### Deploying

```
cd apps/hilocardgame
npm install
zip -qr hilocardgame.zip . -x \.DS_Store
```

Then copy the zip file to [AWS Lambda](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/HiLoCardGame?tab=code).

If you need to update the intents schema or the utterances, copy those values from the simulator and update them on the [Alexa app dashboard](https://developer.amazon.com/edw/home.html#/skill/amzn1.ask.skill.292b2788-95ef-4aaf-95db-1a45b6b9c4ea/en_US/intentSchema)

## Todos

- Complete refactor
- Tests
- Automated deployment
