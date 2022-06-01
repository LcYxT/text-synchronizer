# text-synchronizer

Simply synchronizing texts input from one browser and output to another browser with websocket

## Requirements

FastAPI (Backend)<br/>
ReactJS (Frontend)

## Usage

1. Start the FastAPI server on any machine with public ip
2. Open the input web page for input
3. Open the output web page for output

Note:

- Output update when pressing enter when input
- Output only show the last line of input

## Launching

1. Start FastAPI server

```
$ uvicorn main:app --reload
```

2. Build static file and serve the static file

```
$ yarn build
$ serve -l 3002 -n build
```
