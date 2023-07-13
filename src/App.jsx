import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import Stats from "./Stats"

export default function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rollCount, setRollCount] = React.useState(0)
  const [timeTaken, setTimeTaken] = React.useState(0)
  const [name, setName] = React.useState("")

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
        setTimeTaken((prevTime) => prevTime + 10);
      }, 10);
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
      setRollCount(prev => prev + 1)
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDie()
      }))
    } else {
      setRollCount(0)
      setTimeTaken(0)
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
    setName(event.target.value)
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
          rollCount={rollCount}
          timeTaken={timeTaken}
          submitScore={submitScore}
          name={name}
          handleName={handleName}
        />
      </section>
      {/* <Leaderboard /> */}
    </>
  )
}