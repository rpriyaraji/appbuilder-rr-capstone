/*
* Firefly text-to-image action
* Gets IMS access token via client credentials, then calls Firefly v3 generate API
*/

const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse } = require('../utils')

const IMS_ENDPOINT = 'https://ims-na1.adobelogin.com/ims/token/v3'
const FIREFLY_ENDPOINT = 'https://firefly-api.adobe.io/v3/images/generate'
const SCOPES = 'openid,AdobeID,session,additional_info,read_organizations,firefly_api,ff_apis'

async function getAccessToken (clientId, clientSecret) {
  const res = await fetch(IMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: SCOPES
    })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`IMS token failed (${res.status}): ${text}`)
  }
  const data = await res.json()
  return data.access_token
}

async function main (params) {
  const logger = Core.Logger('firefly', { level: params.LOG_LEVEL || 'info' })

  try {
    const clientId = params.FIREFLY_CLIENT_ID
    const clientSecret = params.FIREFLY_CLIENT_SECRET
    const prompt = params.prompt || params.__ow_body
      ? (() => {
          try {
            const body = params.__ow_body
              ? JSON.parse(Buffer.from(params.__ow_body, 'base64').toString('utf8'))
              : params
            return body.prompt || params.prompt || 'professional portrait'
          } catch { return params.prompt || 'professional portrait' }
        })()
      : 'professional portrait'

    if (!clientId || !clientSecret) {
      return errorResponse(500, 'Missing FIREFLY_CLIENT_ID or FIREFLY_CLIENT_SECRET', logger)
    }

    logger.info(`Generating image for prompt: ${prompt}`)

    const accessToken = await getAccessToken(clientId, clientSecret)

    const ffRes = await fetch(FIREFLY_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-api-key': clientId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numVariations: 1,
        prompt,
        size: { width: 1024, height: 1024 }
      })
    })

    if (!ffRes.ok) {
      const text = await ffRes.text()
      throw new Error(`Firefly API failed (${ffRes.status}): ${text}`)
    }

    const result = await ffRes.json()
    const imageUrl = result.outputs?.[0]?.image?.url || null

    return { statusCode: 200, body: { imageUrl, prompt } }

  } catch (error) {
    logger.error(error)
    return errorResponse(500, error.message || 'server error', logger)
  }
}

exports.main = main
