/*
* <license header>
*/

const { Core } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters } = require('../utils')

// In-memory store persists for the lifetime of the action container
const store = {
  nextId: 4,
  employees: [
    { id: 1, name: 'John Doe', role: 'Engineer', department: 'Technology' },
    { id: 2, name: 'Jane Smith', role: 'Manager', department: 'Marketing' },
    { id: 3, name: 'Alice Brown', role: 'Designer', department: 'Creative' }
  ]
}

async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    logger.info('Calling the main action')
    logger.debug(stringParameters(params))

    const method = (params.__ow_method || 'get').toLowerCase()

    if (method === 'post') {
      const body = params.__ow_body
        ? JSON.parse(Buffer.from(params.__ow_body, 'base64').toString('utf8'))
        : params

      const { name, role, department } = body
      if (!name || !role || !department) {
        return errorResponse(400, 'missing required fields: name, role, department', logger)
      }

      const employee = { id: store.nextId++, name, role, department }
      store.employees.push(employee)

      return { statusCode: 201, body: { employee } }
    }

    // GET — return all employees
    return { statusCode: 200, body: { employees: store.employees } }

  } catch (error) {
    logger.error(error)
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
