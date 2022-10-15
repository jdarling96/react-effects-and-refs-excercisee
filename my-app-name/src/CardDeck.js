/* import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const CardDeck = () => {
  const remainingCards = useRef();

  const [deckId, setDeckId] = useState([]);
  const [deck, setDeck] = useState([]);
  
  const done = remainingCards.current === 0;
  const drawCard = () => {
    setDeck((deck) => [...deck, deckId[remainingCards.current]]);
    remainingCards.current -= 1;
  };

  useEffect(() => {
    async function getDeckId() {
      try {
        const res = await axios.get(
          "https://deckofcardsapi.com/api/deck/new/draw/?count=52"
        );
        setDeckId(res.data.cards);
        remainingCards.current = 52
        
      } catch (error) {
        console.log(error);
      }
    }
    getDeckId();
  }, []);
  



  return (
    <div>
      {!done && <button onClick={drawCard}>GIMME A CARD</button>}

      {deck.map(({ image }, idx) => (
        <Card key={idx} image={image} />
      ))}
    </div>
  );
};

export default CardDeck;
 */

/* import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const CardDeck = () => {
  const remainingCards = useRef(0);
  const timerId = useRef(0);

  const [deckId, setDeckId] = useState([]);
  const [deck, setDeck] = useState([]);
  const [count, setCount] = useState(0);

  const done = remainingCards.current === 52;
  const drawCard = () => {
    timerId.current = setInterval(() => {
        
        setDeck((deck) => [...deck, deckId[remainingCards.current]]);
        return remainingCards.current += 1
        
      }, 1000);
    
  };

  useEffect(() => {
    async function getDeckId() {
      try {
        const res = await axios.get(
          "https://deckofcardsapi.com/api/deck/new/draw/?count=52"
        );
        setDeckId(res.data.cards);
        
      } catch (error) {
        console.log(error);
      }
    }
    getDeckId();
  }, []);

 

  console.log(count)

  return (
    <div>
      {!done && <button onClick={drawCard}>GIMME A CARD</button>}

      {deck.map(({ image }, idx) => (
        <Card key={idx} image={image} />
      ))}
    </div>
  );
};

export default CardDeck;
 */

import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

/* Deck: uses deck API, allows drawing card at a time. */

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  /* At mount: load deck from API into state. */
  useEffect(() => {
    async function getData() {
      let d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(d.data);
    }
    getData();
  }, [setDeck]);

  /* Draw one card every second if autoDraw is true */
  useEffect(() => {
    /* Draw a card via API, add card to state "drawn" list */
    async function getCard() {
      let { deck_id } = deck;

      try {
        let drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);

        if (drawRes.data.remaining === 0) {
          setAutoDraw(false);
          throw new Error("no cards remaining!");
        }

        const card = drawRes.data.cards[0];

        setDrawn(d => [
          ...d,
          {
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image
          }
        ]);
      } catch (err) {
        alert(err);
      }
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]);

  const toggleAutoDraw = () => {
    setAutoDraw(auto => !auto);
  };

  const cards = drawn.map(c => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="Deck">
      {deck ? (
        <button className="Deck-gimme" onClick={toggleAutoDraw}>
          {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
        </button>
      ) : null}
      <div className="Deck-cardarea">{cards}</div>
    </div>
  );
}

export default Deck;