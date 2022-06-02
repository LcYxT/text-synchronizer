import React, { useEffect } from 'react';
import { useState } from 'react';
import './App.css';

function App() {
  const [currentText, setCurrentText] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [fontSize, setFontSize] = useState(18)
  const [fontColor, setFontColor] = useState('#000000')
  const [ws, setWs] = useState<WebSocket | null>()
  const searchParams = new URLSearchParams(window.location.search)
  useEffect(() => {
    const websocket = new WebSocket('wss://mwml.xyz/ws')

    websocket.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      if (msg.type === 'sync_text') {
        setCurrentText(msg.data.current_text)
        setDisplayText(msg.data.text)
      }
      else if (msg.type === 'setting') {
        console.log(msg.data.fontSize)
        setFontSize(msg.data.fontSize)
        setFontColor(msg.data.fontColor)
      }
    }
    websocket.onopen = () => {
      console.log('connected')
      setWs(websocket)
    }
    websocket.onclose = () => {
      console.log('websocket closed')
      setWs(null)
    }
  }, [])

  return searchParams.get('out') === 'true'
    ?
    <p style={{ WebkitTextStroke: "0.01em black", color: fontColor, margin: 0, textAlign: "center", fontSize: `${fontSize}px` }} >{displayText}</p>
    :
    (<div className="App">
      <p style={{ WebkitTextStroke: "0.01em black", color: fontColor, margin: 0, textAlign: "center", fontSize: `${fontSize}px` }} >文字预覧: {displayText === '' ? '無' : displayText}</p>
      <label>文字大小: </label><input placeholder={fontSize.toString()} style={{ width: '60px' }} onChange={(e) => setFontSize(parseInt(e.target.value))} /><br />
      <label>文字颜色设定: </label><input placeholder={fontColor} style={{ width: '60px' }} onChange={(e) => setFontColor(e.target.value)} /><br />
      <button type='button'
        onClick={() => {

          if (ws) ws.send(JSON.stringify({
            type: "setting",
            data: {
              fontSize: fontSize,
              fontColor: fontColor
            }
          }))
        }}>套用设定</button><br />
      <textarea
        style={{ fontSize: "20px", marginTop: "3%", marginBottom: "3%", width: "90%", maxWidth: "70%", height: "40vh" }}
        placeholder='请输入文字后按下enter换行更新文字'
        value={currentText}
        onChange={(e) => {
          setCurrentText(e.target.value)
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            const lastRow = currentText.split('\n')[currentText.split('\n').length - 2]
            if (ws) ws.send(JSON.stringify({
              type: "sync_text",
              data: {
                text: lastRow,
                current_text: currentText
              }
            }))
          }
        }}
      /><br />
      <a href='/textsync/?out=true'>请到此网址检视输出</a>
    </div>
    );
}

export default App;
