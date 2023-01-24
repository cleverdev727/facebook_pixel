/**
 * prevent loading the same
 * script multiple times
 *
 * @param {*} isSandbox - flag that determines
 * if this is a sandbox environment
 * @returns void
 */
export const loadYotpoScript = (isSandbox) => {
  const env = isSandbox ? 'sandbox' : 'prod'
  const key = isSandbox ? '8en4oF332q6a2WB6pCRpLQ' : '930YXJ3rxnfJAazP3wDmAg'
  const id = `yotpo-script-loader-${env}`
  const scriptSrc = `https://cdn-widgetsrepository.yotpo.com/v1/loader/${key}`
  let yotpoScript = document.getElementById(id)
  if (yotpoScript) return

  yotpoScript = document.createElement('script')
  yotpoScript.id = id
  yotpoScript.setAttribute('src', scriptSrc)
  document.head.appendChild(yotpoScript)
}
