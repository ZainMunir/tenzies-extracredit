import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import Stats from "./Stats"
import { tenziesLeaderboard, db } from "../api/firebase"
import {
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore"

export default function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [stats, setStats] = React.useState({
    rollCount: 0,
    timeTaken: 0,
    date: Date.now(),
    name: "",
  })
  const [leaderboard, setLeaderboard] = React.useState([])
  const [submitted, setSubmitted] = React.useState(false)

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [dice])

  React.useEffect(() => {
    let interval;
    if (!tenzies) {
      interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          timeTaken: prev.timeTaken + 1000
        }))
      }, 1000);
    } else if (tenzies) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [tenzies]);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(tenziesLeaderboard, function (snapshot) {
      const boardArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setLeaderboard(boardArr)
    })
    return unsubscribe
  }, [])

  const leaderboardElements = leaderboard.sort((a, b) => a.rollCount - b.rollCount).map(x => {
    return (
      <div key={x.id} className="leaderboard--entry">
        <p>{x.name}</p>
        <p>{x.rollCount}</p>
        <p>{x.timeTaken / 1000}s</p>
        <p> {formatDate(x.date)} </p>
      </div>
    )
  })

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if (!tenzies) {
      setStats(prev => ({
        ...prev,
        rollCount: prev.rollCount + 1
      }))
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDie()
      }))
    } else {
      setStats(prev => ({
        ...prev,
        rollCount: 0,
        timeTaken: 0,
        date: Date.now(),
      }))
      setSubmitted(false)
      setTenzies(false)
      setDice(allNewDice())
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    }))
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  function handleName(event) {
    setStats(prev => ({
      ...prev,
      name: event.target.value
    }))
  }

  async function submitScore() {
    if (stats.name.trim() === "") {
      alert("enter a name")
      return;
    }
    setSubmitted(true)
    await addDoc(tenziesLeaderboard, stats)
  }

  return (
    <>
      {tenzies && <Confetti width={window.innerWidth - 20} height={window.innerHeight - 20} />}
      <section className="tenzies">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same.
          Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
          {diceElements}
        </div>
        <button
          className="roll-dice"
          onClick={rollDice}
        >
          {tenzies ? "New Game" : "Roll"}
        </button>
        <Stats
          tenzies={tenzies}
          rollCount={stats.rollCount}
          timeTaken={stats.timeTaken}
          submitScore={submitScore}
          name={stats.name}
          submitted = {submitted}
          handleName={handleName}
        />
      </section>
      <section className="leaderboard">
        <h1 className="title">Leaderboard</h1>
        <div className="leaderboard--table">
          <p>Name</p>
          <p>Rolls</p>
          <p>Time</p>
          <p>Date</p>
        </div>
        <div className="leaderboard--entries">
        {leaderboardElements}
        </div>
      </section>
    </>
  )
}