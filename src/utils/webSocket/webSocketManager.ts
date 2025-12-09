import SockJS from 'sockjs-client'

type SockJSLike = {
  send: (data: string) => void
  onopen?: ((event: Event) => void) | null
  onerror?: ((event: Event) => void) | null
  onmessage?: ((event: MessageEvent) => void) | null
  onclose?: ((event: CloseEvent) => void) | null
}

type SockJSFactory = (url: string) => SockJSLike

export class WebSocketManager {
  private sockjs: SockJSLike | undefined = undefined

  private static INSTANCE = new WebSocketManager()

  private static sockFactory: SockJSFactory = (url: string) => new SockJS(url)

  static getInstance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new WebSocketManager()
    }
    return WebSocketManager.INSTANCE
  }

  static setSockJSFactory(factory: SockJSFactory) {
    WebSocketManager.sockFactory = factory
  }

  static resetSockJSFactory() {
    WebSocketManager.sockFactory = (url: string) => new SockJS(url)
  }

  constructor() {}

  install() {
    this.sockjs = WebSocketManager.sockFactory('http://127.0.0.1:5000/sockjs')
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
