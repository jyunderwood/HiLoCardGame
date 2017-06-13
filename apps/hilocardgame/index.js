"use strict";
module.change_code = 1;

const alexa = require('alexa-app');
const _ = require('lodash');
const config = require('./package.json').config;

const app = new alexa.app(config.applicationName);
app.id = config.applicationId;

app.launch((request, response) => {
  response.session('totalPlayed', 0);
  response.session('totalWon', 0);

  const prompt = 'Lets play a game of Hi Low. Say deal to start a new game.';
  response.say(prompt).reprompt(prompt).shouldEndSession(false);
});

const cancelIntent = (request, response) => {
  const totalPlayed = request.session('totalPlayed');
  const totalWon = request.session('totalWon');

  response.say(`You won ${totalWon} out of ${totalPlayed} games. Goodbye!`).shouldEndSession(true);
};

app.intent('AMAZON.CancelIntent', {}, cancelIntent);
app.intent('AMAZON.StopIntent', {}, cancelIntent);

app.intent('AMAZON.HelpIntent', {}, (request, response) => {
  const help = `
    To start a new game, say deal.
    You can also say stop or cancel to exit.
    This game ranks an ace higher than a king,
    and suits are in ascending alphabetical order:
    clubs, diamonds, hearts, and spades.
  `;

  response.say(help).shouldEndSession(false);
});

app.intent('DealIntent', {
  'utterances': [
    'deal',

    'new',
    'new game',

    'start',
    'start game'
  ]
}, (request, response) => {
  response.session('totalPlayed', request.session('totalPlayed') + 1);

  const [firstCard, secondCard] = newGame();
  response.session('firstCard', firstCard);
  response.session('secondCard', secondCard);

  const prompt = 'Shuffling... Two cards dealt. ';
  const reprompt = `The first card is the ${firstCard}. Will the second card be higher or lower than the ${firstCard}.`;
  response.say(prompt + reprompt).reprompt(reprompt).shouldEndSession(false);
})

app.intent('GuessIntent', {
    'slots': {
      'guess': 'PossibleGuesses'
    },

    'utterances': [
      '{-|guess}'
    ]
  },

  (request, response) => {
    const firstCard = request.session('firstCard');
    const secondCard = request.session('secondCard');
    const guess = request.slot('guess');

    if (guess) {
      response.reprompt('To play another game, say deal. You can also say stop or cancel to exit.');

      if (guess === 'higher') {
        if (isFirstCardHigher(firstCard, secondCard)) {
          response.say(`Sorry, but the ${secondCard} is not higher than the ${firstCard}.   To play another game, say deal.`);
        } else {
          response.session('totalWon', request.session('totalWon') + 1);
          response.say(`Congratulations. the ${secondCard} is higher than the ${firstCard}.   To play another game, say deal.`)
        }
      }

      if (guess === 'lower') {
        if (isFirstCardHigher(firstCard, secondCard)) {
          response.session('totalWon', request.session('totalWon') + 1);
          response.say(`Congratulations. the ${secondCard} is lower than the ${firstCard}.   To play another game, say deal.`)
        } else {
          response.say(`Sorry, but the ${secondCard} is not lower than the ${firstCard}.   To play another game, say deal.`);
        }
      }
    } else {
      response.reprompt(
        'Sorry, I didn\'t understand your guess. ' +
        `The first card is the ${firstCard}. Will the second card be higher or lower than the ${firstCard}?`
      );
    }

    response.shouldEndSession(false);
  }
);

const ranks = {
  two:   12,
  three: 13,
  four:  14,
  five:  15,
  six:   16,
  seven: 17,
  eight: 18,
  nine:  19,
  ten:   20,
  jack:  21,
  queen: 22,
  king:  23,
  ace:   24
};

const suits = {
  clubs:    1,
  diamonds: 2,
  hearts:   3,
  spades:   4
};

const deckOfCards = () => {
  let deckOfCards = {};

  Object.keys(ranks).forEach(rank => {
    const ranking = ranks[rank];

    Object.keys(suits).forEach(suit => {
      const suiting = suits[suit];
      deckOfCards[`${rank} of ${suit}`] = parseInt(`${ranking}${suiting}`);
    });
  });

  return deckOfCards;
}

const newGame = () => {
  const deck = Object.keys(deckOfCards());
  const shuffledDeck = _.shuffle(deck);

  return shuffledDeck.slice(0, 2);
}

const isFirstCardHigher = (firstCard, secondCard) => {
  const deck = deckOfCards();

  const firstCardValue = deck[firstCard];
  const secondCardValue = deck[secondCard];

  return firstCardValue > secondCardValue;
};

module.exports = app;
