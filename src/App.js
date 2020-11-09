import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase from './firebase';

function App() {

  const db = firebase.firestore();
  const [textValue, setTextValue] = useState('');
  const [imageUrlValue, setImageUrlValue] = useState('');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    db.collection("cards")
    .onSnapshot((querySnapshot) => {
        let cards = [];
        querySnapshot.forEach(function (doc) {
          cards.push({...doc.data(), ...{docId: doc.id}});
        });
        setCards(cards);
      });
  }, [])

  const onInput = (e) => {
    if (e.target.name === 'textValue') {
      setTextValue(e.target.value);
    }
    else {
      setImageUrlValue(e.target.value);
    }
  }

  const onClick = () => {
    db.collection("cards").add({
      text: textValue,
      imageUrl: imageUrlValue
    })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

  const getCards = () => {
    return (
      <div className="cards">
        {
          cards.map((card, index) => {
            return (
              <div key={index} className="card">
                <p className="text">{card.text}</p>
                <img className="image" src={card.imageUrl} alt="en bild"/>
                <button onClick={() => remove(card.docId)} className="remove">Ta bort</button>
              </div>
            );
          })
        }
      </div>
    )
  }

  const remove = (docId) => {
    db.collection("cards").doc(docId).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input placeholder="Text" name="textValue" value={textValue} onInput={onInput}></input>
        <input placeholder="Image url" name="imageUrlValue" value={imageUrlValue} onInput={onInput}></input>

        <p>Input: {textValue}</p>
        <button onClick={onClick}>Add card</button>
        
      </header>
      {getCards()}
  
    </div>
  );
}

export default App;
