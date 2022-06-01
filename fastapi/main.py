from fastapi import FastAPI
from fastapi.websockets import WebSocket, WebSocketDisconnect

app = FastAPI()

text = ''
font_size = 50
font_color = '#FFFFFF'

active_connections = []

@app.get("/textsync")
async def root():
    return {"message": "Hello World"}

@app.websocket_route("/ws")
async def websocket(websocket: WebSocket):
    global text, font_size, font_color, active_connections
    await websocket.accept()
    active_connections.append(websocket)
    print(f'number of connections: {len(active_connections)}')
    await websocket.send_json({"type": "sync_text", "data": {"text": text}})
    await websocket.send_json({"type": "setting", "data": {"fontSize": font_size, "fontColor": font_color}})
    try:
        while True:
            data = await websocket.receive_json()
            if data['type'] == 'sync_text':
                text = data['data']['text']
            elif data['type'] == 'setting':
                font_size = data['data']['fontSize']
                font_color = data['data']['fontColor']
            for connection in active_connections:
                await connection.send_json(data)
    except WebSocketDisconnect:
        active_connections.remove(websocket)