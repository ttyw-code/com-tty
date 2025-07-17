import SockJS from 'sockjs-client'

type WSCallback = (msg: any) => void

class WebSocketManager<K extends string, V extends WSCallback> {
  private sockjs: WebSocket | undefined = undefined
  private subscribeMap = new Map<K, V>()

  constructor() {}

  install() {
    this.sockjs = new SockJS('http://127.0.0.1:5000/sockjs')
    this.sockjs.onopen = () => {
      console.log('连接打开..')
    }

    this.sockjs.onerror = (er) => {
      console.log('错误..', er)
    }

    this.sockjs.onmessage = (msg) => {
      console.log(msg.data)
    }

    this.sockjs.onclose = () => {
      console.log('连接关闭..')
    }
  }

  sendMessage() {
    this.sockjs?.send('this message from client')
  }
}

export default new WebSocketManager()
