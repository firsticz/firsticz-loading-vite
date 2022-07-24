import { useState, useRef, useEffect } from 'react'
import './App.css'
import config from './config'
import useSound from 'use-sound'
import soundUrl from './music/song.mp3'
import PlayPause from './components/PlayPause'

function App() {
  const [showPlayButton, setshowPlayButton] = useState(false)
  const [playing, setPlaying] = useState(true);

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

  useEffect(() => {
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
      </div>
      
    </div>
  )
}

export default App
