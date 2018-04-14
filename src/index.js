import data from './config/test-data'
import nodeDraw from './node-draw'
import jsPlumb from 'jsPlumb'
import domConfig from './config/dom.config'

jsPlumb.ready(function () {
  jsPlumb.setContainer(domConfig.nodeBackgroundId)
  jsPlumb.importDefaults({
    ConnectionsDetachable: false
  })

  nodeDraw.draw(data.nodeList)
})
