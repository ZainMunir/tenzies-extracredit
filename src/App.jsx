import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import Stats from "./Stats"

export default function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [stats, setStats] = React.useState({
    rollCount: 0,
    timeTaken: 0,
    date: Date.now(),
    name: "",
  })

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

  function submitScore() {
    // TODO
  }

  return (
    <>
      <section>
        {tenzies && <Confetti />}
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
          handleName={handleName}
        />
      </section>
      {/* <Leaderboard /> */}
    </>
  )
}