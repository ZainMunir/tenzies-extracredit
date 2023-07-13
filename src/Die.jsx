import React from "react"
import Face1 from "./faces/face-1.svg"
import Face2 from "./faces/face-2.svg"
import Face3 from "./faces/face-3.svg"
import Face4 from "./faces/face-4.svg"
import Face5 from "./faces/face-5.svg"
import Face6 from "./faces/face-6.svg"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    function getFace() {
        switch (props.value) {
            case 1:
                return Face1
            case 2:
                return Face2
            case 3:
                return Face3
            case 4:
                return Face4
            case 5:
                return Face5
            case 6:
                return Face6
        }
    }
    const die_face = getFace();
    return (
        <div
            className="die-face"
            style={styles}
            onClick={props.holdDice}
        >
            <img src={die_face} />
        </div>
    )
}