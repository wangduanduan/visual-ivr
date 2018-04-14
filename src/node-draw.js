import getNodesDepth from './data-handle'
import domConfig from './config/dom.config'
import $ from 'jquery'
import nodeTemplate from './template/index'
import Mustache from 'Mustache'
import jsPlumb from 'jsPlumb'
import jsPlumbNodeConfig from './config/jsplumb.config'
import {copyData} from './util'

function getBaseNodeConfig () {
  return copyData(jsPlumbNodeConfig.baseStyle)
}

// 计算节点位置
function computeTopAndLeft (nodes) {
  // 获取节点深度
  var matrix = getNodesDepth(nodes)

  var base = {
    topBase: 50,
    topStep: 150,
    leftBase: 150,
    leftStep: 200
  }

  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      var key = matrix[i][j]

      var dest = nodes.find(function (item) {
        return item.id === key
      })

      dest.top = dest.top || base.topBase + i * base.topStep
      dest.left = dest.left || base.leftBase + j * base.leftStep
    }
  }
}

// 获取节点模板
function getTemplateByNodeType (nodeType) {
  return nodeTemplate[nodeType] || ''
}

  // 让元素可拖动
function addDraggable (id) {
  jsPlumb.draggable(id, {
    containment: 'parent'
  })
}

// 设置入口点
function setEnterPoint (id) {
  var config = getBaseNodeConfig()

  // console.log(config)

  config.isSource = false
  config.maxConnections = -1

  jsPlumb.addEndpoint(id, {
    anchors: 'Top',
    uuid: id + '-in'
  }, config)
}

// 设置出口点
function setExitPoint (id, position) {
  var config = getBaseNodeConfig()

  // console.log(config)

  config.isTarget = false
  config.maxConnections = 1

  jsPlumb.addEndpoint(id, {
    anchors: position || 'Bottom',
    uuid: id + '-out'
  }, config)
}

function connectEndpoint (from, to) {
  jsPlumb.connect({ uuids: [from, to] })
}

let connectEndpoints = {
  Root: function (node) {
    connectEndpoint(node.id + '-out', node.data.nextNode + '-in')
  },
  Announce: function (node) {
    connectEndpoint(node.id + '-out', node.data.nextNode + '-in')
  },
  WorkTime: function (node) {
    connectEndpoint(node.id + '-onWorkTime-out', node.data.onWorkNode + '-in')
    connectEndpoint(node.id + '-offWorkTime-out', node.data.offWorkNode + '-in')
  },
  Menu: function (node) {
    connectEndpoint(node.id + '-noinput-out', node.data.noinput.nextNode + '-in')
    connectEndpoint(node.id + '-nomatch-out', node.data.nomatch.nextNode + '-in')

    node.data.choices.forEach(function (item) {
      connectEndpoint(node.id + '-key-' + item.key + '-out', item.nextNode + '-in')
    })
  }
}

let addEndpoint = {
  Root: function (node) {
    setExitPoint(node.id, 'Bottom')
  },
  Exit: function (node) {
    setEnterPoint(node.id, 'Top')
  },
  Announce: function (node) {
    setEnterPoint(node.id)
    setExitPoint(node.id)
  },
  WorkTime: function (node) {
    setEnterPoint(node.id)

    var ids = ['onWorkTime', 'offWorkTime']

    ids.forEach(function (key) {
      setExitPoint(node.id + '-' + key, 'Right')
    })
  },
  Menu: function (node) {
    setEnterPoint(node.id)

    var ids = ['noinput', 'nomatch']

    node.data.choices.forEach(function (item) {
      ids.push('key-' + item.key)
    })

    ids.forEach(function (key) {
      setExitPoint(node.id + '-' + key, 'Right')
    })
  }
}

// 绘制节点函数
function draw (nodes) {
  // 将Exit节点排到最后
  nodes.sort(function (a, b) {
    if (a.type === 'Exit') return 1
    if (b.type === 'Exit') return -1
    return 0
  })

  // 计算节点位置
  computeTopAndLeft(nodes)

  var $container = $('#' + domConfig.nodeBackgroundId)

  nodes.forEach(function (item, key) {
    var data = {
      id: item.id,
      name: item.id,
      top: item.top,
      left: item.left,
      choices: item.data.choices || []
    }

    var template = getTemplateByNodeType(item.type)

    $container.append(Mustache.render(template, data))
    addDraggable(item.id)

    if (addEndpoint[item.type]) {
      addEndpoint[item.type](item)
    }
  })

  nodes.forEach(function (item, key) {
    if (connectEndpoints[item.type]) {
      connectEndpoints[item.type](item)
    }
  })
}

export default {
  draw
}
