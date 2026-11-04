export async function PromiseMain() {
  const drain = () => new Promise((r) => setTimeout(r, 0))
  const out = [] as any[]
  const L = (s: string) => out.push(s)

  const p = Promise.resolve('v')
  L('sync')
  ;(async () => {
    await p
    L('await 恢复')
  })()
  p.then(() => L('then'))
  queueMicrotask(() => L('queueMicrotask'))
  setTimeout(() => L('setTimeout 宏任务'))

  await drain()
  console.log(out)
}

console.log('---------------------start')
void PromiseMain()
console.log('---------------------end')
