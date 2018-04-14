import graphlib from 'graphlib'
import {copyData} from './util'

var dealNode = {
  Root: function (g, node) {
    setEdge(g, node.id, node.data.nextNode)
  },
  Announce: function (g, node) {
    setEdge(g, node.id, node.data.nextNode)
  },
  Exit: function (g, node) {

  },
  WorkTime: function (g, node) {
    setEdge(g, node.id, node.data.onWorkNode)
    setEdge(g, node.id, node.data.offWorkNode)
  },
  Menu: function (g, node) {
    setEdge(g, node.id, node.data.nextNode)
  }
}

function getIvrNodeIds (nodes) {
  return nodes.map(function (item) {
    return item.id
  })
}

function setEdge (g, from, to) {
  // console.log(from + ' ---> ' + to)
  g.setEdge(from, to)
}

function generateDepth (deep) {
  var depth = []

  Object.keys(deep).forEach(function (key) {
    var distance = deep[key].distance

    if (!depth[distance]) {
      depth[distance] = []
    }

    depth[distance].push(key)
  })

  return depth
}

function main (nodes) {
  nodes = copyData(nodes)
  var nodeIds = getIvrNodeIds(nodes)
  var g = new graphlib.Graph()

  nodeIds.forEach(function (id) {
    g.setNode(id)
  })

  nodes.forEach(function (item) {
    if (dealNode[item.type]) {
      dealNode[item.type](g, item)
    } else {
      // console.error('have no deal node of ' + item.type)
    }
  })

  var distance = graphlib.alg.dijkstra(g, 'Start')

  return generateDepth(distance)
}

export default main
