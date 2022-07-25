import { useState, useRef, useEffect } from 'react'
import './App.css'
import config from './config'
import useSound from 'use-sound'
import soundUrl from './music/song.mp3'
import PlayPause from './components/PlayPause'

function App() {
  const [showPlayButton, setshowPlayButton] = useState(false)
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(0)

  const audioRef = useRef(new Audio(soundUrl));
  const btnRef = useRef()

  // audioRef.current.autoplay = true

  const play = () => {
    setPlaying(true);
    audioRef.current.play();
  };

  const pause = () => {
    setPlaying(false);
    audioRef.current.pause();
  };

  const handleSpace= (e) => {
    console.log(e);
    if (e.keyCode === 32) {
      setshowPlayButton(!showPlayButton)
    }
  };

  const handleClick = () => {
    setshowPlayButton(!showPlayButton)
    playing ? pause(): play()
  }

  //MESSAGE
  console.log(playing);
  playing ? audioRef.current.play() : pause

  const handleKeyDown = () => {
    console.log('keydown');
  }

  // PROGRESS
  let states = {
    'INIT_BEFORE_MAP_LOADED': {
      count: 0,
      done: 0
    },
    'MAP': {
      count: 0,
      done: 0
    },
    'INIT_AFTER_MAP_LOADED': {
      count: 0,
      done: 0
    },
    'INIT_SESSION': {
      count: 0,
      done: 0
    }
  };

  const handlers = {
    startInitFunctionOrder: (data) => {
      // Reconnecting
      if (data.type == 'INIT_SESSION' && states['INIT_BEFORE_MAP_LOADED'].count < 1) {
        states['INIT_BEFORE_MAP_LOADED'].count = 1;
        states['INIT_BEFORE_MAP_LOADED'].done = 1;
        states['MAP'].count = 1;
        states['MAP'].done = 1;
        states['INIT_AFTER_MAP_LOADED'].count = 1;
        states['INIT_AFTER_MAP_LOADED'].done = 1;
      }
  
      states[data.type].count += data.count;
    },
    initFunctionInvoked: (data) => states[data.type].done++,
    startDataFileEntries: (data) => states['MAP'].count = data.count,
    performMapLoadFunction: (data) => states['MAP'].done++
  };

  window.addEventListener('message', (e) => (handlers[e.data.eventName] || (() => {}))(e.data));

  let last = 0;

  useEffect(() => {
    setInterval(() => {
      let progress = 0;
      for (let type in states) {
        if (states[type].done < 1 || states[type].count < 1) continue;
        progress += (states[type].done / states[type].count) * 100;
      }
    
      let total = Math.min(Math.round(progress / Object.keys(states).length), 100);
      if (total < last) total = last;
      last = total;
      setLoading(total)
    }, 100)
    window.addEventListener('keydown', handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [])

  return (
    <div className="App" ref={btnRef}>
      <div className='center'>
        <div className='title'><span style={{color: '#ff0000'}}>FirsticZ</span >CITY</div>
        <div style={{width: '99%'}}>
          <div className='songstop'>กด<span style={{color: '#00b7ff'}}> SPACEBAR</span> เพื่อหยุดเล่นเพลง</div>
            <button
              onClick={() => handleClick()}
              onKeyDown={handleClick}
              // onLoad={play()}
              style={{
                border: "none",
                backgroundColor: "#ff8d8d",
                boxShadow: "0 0 4px 2px rgba(0,0,0,.2)",
                cursor: "pointer",
                height: 40,
                outline: "none",
                borderRadius: "100%",
                width: 40
              }}
            >
              <PlayPause buttonToShow={showPlayButton ? "play" : "pause"}/>
          </button>
        </div>
        <div className="w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
          <div className="h-6 bg-blue-600 rounded-full dark:bg-blue-500" style={{width: `${loading}%`}}>{loading}%</div>
        </div>
      </div>
      
    </div>
  )
}

export default App
