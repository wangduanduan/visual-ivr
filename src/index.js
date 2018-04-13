import config from './config/jsplumb.config'
import request from './api'

/* console */
function sayHello (params) {
  console.log(config)
  console.log(request)
}

sayHello()
