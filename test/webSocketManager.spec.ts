import { expect } from 'chai'
import { WebSocketManager } from '../src/utils/webSocket/webSocketManager'

type MockSock = {
  send: (data: string) => void
  onopen?: ((event: Event) => void) | null
  onerror?: ((event: Event) => void) | null
  onmessage?: ((event: MessageEvent) => void) | null
  onclose?: ((event: CloseEvent) => void) | null
}

describe('WebSocketManager', () => {
  afterEach(() => {
    WebSocketManager.resetSockJSFactory()
  })

  it('returns the same singleton instance', () => {
    const first = WebSocketManager.getInstance()
    const second = WebSocketManager.getInstance()
    const third = new WebSocketManager()
    expect(first).to.equal(second)
  })

  it('installs SockJS connection through the factory', () => {
    let capturedUrl: string | null = null
    const mockSock: MockSock = {
      send: () => {
        /* noop */
      },
      onopen: null,
      onerror: null,
      onmessage: null,
      onclose: null,
    }

    WebSocketManager.setSockJSFactory((url) => {
      capturedUrl = url
      return mockSock
    })

    const manager = WebSocketManager.getInstance()
    manager.install()

    expect(capturedUrl).to.equal('http://127.0.0.1:5000/sockjs')
    expect(mockSock.onopen).to.be.a('function')
    expect(mockSock.onerror).to.be.a('function')
    expect(mockSock.onmessage).to.be.a('function')
    expect(mockSock.onclose).to.be.a('function')
  })

  it('delegates sendMessage to the underlying SockJS instance', () => {
    let lastSent: string | null = null
    const mockSock: MockSock = {
      send: (payload: string) => {
        lastSent = payload
      },
      onopen: null,
      onerror: null,
      onmessage: null,
      onclose: null,
    }

    WebSocketManager.setSockJSFactory(() => mockSock)

    const manager = WebSocketManager.getInstance()
    manager.install()
    manager.sendMessage()

    expect(lastSent).to.equal('this message from client')
  })
})
