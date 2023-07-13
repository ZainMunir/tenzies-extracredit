import React from "react"

export default function Stats(props) {
    return (
        <>
            <div className="stats">
                <p>Rolls: {props.rollCount}</p>
                <p>Time: {Math.floor(props.timeTaken / 1000)}s</p>
                {props.tenzies && <>
                    <input type="text" maxLength="20" value={props.name} onChange={props.handleName} placeholder="Name" />
                    <button onClick={props.submitScore}>Submit Score</button>
                </>}
            </div>
        </>
    )
}
