import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyboardReact from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../Assets/Styles/Game.css";
import randomWords from "random-words";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { useLocation, useNavigate } from "react-router-dom";
import { userAccessDispatchers } from "../Redux/Reducers/userSlice";

const Game = (props) => {
 
  const dispatch = useDispatch();
  const [user, setUser] = useState({})
  const userObj = useSelector((state) => state.user);
  const navigate = useNavigate();
  const keyboard = useRef();
  const [level, setLevel] = useState(userObj.user.level? userObj.user.level : 0);
  const [score, setScore] = useState(userObj.user.score? userObj.user.score : 0);
  const [multiple, setMultiple] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [words, setWords] = useState([]);
  const [totalWords, setTotalWords] = useState(0);
  const [leftWords, setleftWords] = useState(0);
  const [layout, setLayout] = useState("default");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [startInterval, setStartInterval] = useState(true);
  const [looseFlag, setLooseFlag] = useState(false);
  const [levelUpFlag, setLevelFlag] = useState(false);
 

  const themeNormal = {
    backgroundColor: "#ececec",
    borderRadius: "5px",
    boxSizing: "border-box",
    fontFamily:
      "HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif",
    overflow: "hidden",
    padding: "5px",
    touchAction: "manipulation",
    "-webkit-user-select": "none",
    userSelect: "none",
    width: "640px",
  };
  
 useEffect(() => {
   if (userObj.authorised === false) {
      navigate('/')
    }
    if (userObj.user) {
      setUser(userObj.user);
    }
 }, [userObj])
  
  useEffect(() => {
    if (startInterval) {
      let myInterval = setInterval(() => {
        if (seconds > 0) {
          if (words.length !== 0) {
            setSeconds((prevState) => prevState - 1);
          } else {
            setMinutes(0);
            setSeconds(0);
            clearInterval(myInterval);
            setLevelFlag(true);
            var audio = new Audio("../Assets/Audio/levelUp.mp3");
            audio.play();
            setTimeout(() => {
              setLevelFlag(false);
            }, 2000);
            calculate();
            setStartInterval(false);
          }
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(myInterval);
            setWords([]);
            setStartInterval(false);
          } else {
            setMinutes((prevState) => prevState - 1);
            setSeconds(59);
          }
        }
      }, 850);
      return () => {
        clearInterval(myInterval);
      };
    }
  });
  useEffect(() => {
    if (!startInterval) {
      if (minutes === 0 && seconds === 0) {
        calculate();
      }
    }
  }, [startInterval, minutes, seconds]);
  const calculate = () => {
    if (startInterval) {
      if (multiple !== 0) {
        if (level === 0) {
          let data = 1 * totalWords * multiple;
          console.log("data", data);
          setScore(data);
        } else {
          let data = (level-1) * totalWords * multiple;
          console.log("data", data);
          setScore(data);
        }
      } else {
        if (level === 0) {
          let data = 1 * totalWords;
          console.log("data", data);
          setScore(data);
        } else {
          let data = (level-1) * totalWords;
          console.log("data", data);
          setScore(data);
        }
      }
      setLevel((prevState) => prevState + 1);
      let data = {
        "_id": user._id,
        "level": level,
        "score":score,
      }
      dispatch(userAccessDispatchers.update(data));
    }
    setMultiple(0);
  };
  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      if (words.length !== 0) {
        if (startInterval) {
          setLooseFlag(true);
          var audio = new Audio("../Assets/Audio/loose.mp3");
          audio.play();
          setTimeout(() => {
            setLooseFlag(false);
          }, 2000);
        }
      }
    }
  }, [minutes, seconds]);
  const change = (input) => {
    console.log("Input changed", input);
  };

  const KeyPress = (button) => {
    console.log("Button pressed", button);
  };
  const onChangeInput = (event) => {
    const input = event.target.value;
    console.log(event.key);
    console.log(input);
    if (event.keyCode === 8 || event.keyCode === 46) {
      setInputValue("");
      var audio = new Audio("../Assets/Audio/wrong.mp3");
      audio.play();
      setMultiple(0);
    } else {
      setInputValue(input);
    }

    if (event.key === "Enter") {
      if (input === words[0]) {
        var audio = new Audio("../Assets/Audio/correct.mp3");
        audio.play();
        words.splice(0, 1);
        setInputValue("");
        setMultiple((prevState) => prevState + 1);
      } else {
        var audio = new Audio("../Assets/Audio/wrong.mp3");
        audio.play();
        setMultiple(0);
      }
    }

    keyboard.current.setInput(input);
  };
  const handleTimerData = (value) => {
    console.log(value);
  };
  const startTimer = () => {
    
    if (level === 0) {
      setMinutes(0);
      setSeconds(40);
      setWords(randomWords(10));
      setTotalWords(10);
    } else {
      setMinutes(level);
      setSeconds(30);
      setWords(randomWords(level * 10));
      setTotalWords(level * 10);
    }

    setStartInterval(true);
  };
  const logout = () => {
    saveHandle();
    setTimeout(() => {
      localStorage.removeItem('token');
    dispatch(userAccessDispatchers.logout())
    navigate('/')
    },100)
    

  }
  const saveHandle = () => {
    let data = {
      "_id": user._id,
      "level": level,
      "score":score,
    }
    dispatch(userAccessDispatchers.update(data));
  }
  return (
    <div className="Game">
      <div className="banner">
        Hello
        <span className="name-bnr">{user.fullName } </span>
        <span className="logout" onClick={()=>logout()}>Logout</span>
      </div>
      <div className="game-section">
        <div className="param-container">
          <div className="container">
            <div>{level}</div>
            <span>LEVEL</span>
          </div>
          <div className="container">
            <div>{score}</div>
            <span>SCORE</span>
          </div>
          <div className="container">
            <div>{multiple}X</div>
          </div>
        </div>

        <div className="timer-div">
          {looseFlag ? (
            <div className="lottie">
              <Player
                autoplay
                src={"../Assets/LottieFiles/gameOver.json"}
                style={{ height: "300px", width: "300px" }}
              >
                {" "}
              </Player>
            </div>
          ) : null}
          {levelUpFlag ? (
            <div className="lottie">
              <div className="levelUp">LEVEL UP</div>
              <Player
                autoplay
                src={"../Assets/LottieFiles/happyStar.json"}
                style={{ height: "300px", width: "300px" }}
              >
                {" "}
              </Player>
            </div>
          ) : null}
          <div className="wordsInfo">
            Total Words: {words.length === 0 ? `00` : words.length}
          </div>
          <button
            className="timer-btn"
            style={startInterval ? { opacity: "0.5" } : { opacity: "1" }}
            onClick={() => startTimer()}
            disabled={startInterval ? true : false}
          >
            Start
          </button>
          <div className="timer">
            <h1>
              {" "}
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </h1>
          </div>
          <button
            className="timer-btn"
            style={startInterval ? { opacity: "0.5" } : { opacity: "1" }}
            onClick={() => saveHandle()}
            disabled={startInterval ? true : false}
          >
            Save Game
          </button>
        </div>

        <div className="word-wrap">
          {words.length > 0 ? (
            words.map((data, index) => (
              <span
                key={index}
                className="words"
                style={index === 0 ? { color: "green" } : { color: "black" }}
              >
                {data}
              </span>
            ))
          ) : (
            <span className="words">
              Words will come here as you hit start button...
            </span>
          )}
        </div>
        <div style={{ color: "white" }}>
          *Press Enter after each words and BackSpace and Delete will erase<br />
          Every right word will increase multiple if wrong will come to 0
        </div>
        <div>
          <input
            disabled={startInterval ? false : true}
            className="keyboard-input"
            value={inputValue}
            placeholder={" Click here to type....."}
            onKeyDown={onChangeInput}
            onChange={onChangeInput}
          />
          <div className="keyboard-wrapper">
            <div className="keyboard">
              <KeyboardReact
                keyboardRef={(r) => (keyboard.current = r)}
                physicalKeyboardHighlight
                onChange={change}
                onKeyPress={KeyPress}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
