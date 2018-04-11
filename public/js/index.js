/* global $, visoConfig, Mustache, uuid, jsPlumb, graphlib */

(function () {
  var root = {}

  window.IVR = root

  root.emit = function (event) {
    console.log(event)
  }

  var area = 'drop-bg'
  var areaId = '#' + area
  var fixedNodeId = {
    begin: 'begin-node',
    end: 'end-node'
  }

  jsPlumb.ready(main)
  jsPlumb.importDefaults({
    ConnectionsDetachable: false
  })

  // 放入拖动节点
  function dropNode (template, position) {
    position.left -= $('#side-buttons').outerWidth()
    position.id = uuid.v1()
    position.generateId = uuid.v1
    var html = renderHtml(template, position)

    $(areaId).append(html)

    initSetNode(template, position.id)
  }

  // 初始化节点设置
  function initSetNode (template, id) {
    addDraggable(id)

    if (template === 'tpl-audio') {
      setEnterPoint(id)
      setExitPoint(id)
    } else if (template === 'tpl-menu') {
      setEnterPoint(id + '-heading')
      setExitMenuItem(id)
    }
  }

  // 设置入口点
  function setEnterPoint (id) {
    var config = getBaseNodeConfig()

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

    config.isTarget = false
    config.maxConnections = 1

    jsPlumb.addEndpoint(id, {
      anchors: position || 'Bottom',
      uuid: id + '-out'
    }, config)
  }

  function setExitMenuItem (id) {
    $('#' + id).find('li').each(function (key, value) {
      setExitPoint(value.id, 'Right')
    })
  }

  // 删除一个节点以及
  function emptyNode (id) {
    jsPlumb.remove(id)
  }

  // 让元素可拖动
  function addDraggable (id) {
    jsPlumb.draggable(id, {
      containment: 'parent'
    })
  }

  // 渲染html
  function renderHtml (type, position) {
    return Mustache.render($('#' + type).html(), position)
  }

  function eventHandler (data) {
    if (data.type === 'deleteNode') {
      emptyNode(data.id)
    }
  }

  // 主要入口
  function main () {
    jsPlumb.setContainer('diagramContainer')

    $('.btn-controler').draggable({
      helper: 'clone',
      scope: 'ss'
    })

    $(areaId).droppable({
      scope: 'ss',
      drop: function (event, ui) {
        dropNode(ui.draggable[0].dataset.template, ui.position)
      }
    })

    $('#app').on('click', function (event) {
      event.stopPropagation()
      event.preventDefault()
      eventHandler(event.target.dataset)
    })

    // 单点击了连接线上的X号
    jsPlumb.bind('dblclick', function (conn, originalEvent) {
      DataDraw.deleteLine(conn)
    })

    // 当链接建立
    jsPlumb.bind('beforeDrop', function (info) {
      return connectionBeforeDropCheck(info)
    })

    // 让退出节点可拖动
    // addDraggable(fixedNodeId.end)
    // initBeginNode()
    // initEndNode()

    // DataProcess.inputData(data.nodeList)
    // DataDraw.draw(data.nodeList)
  }

  // 链接建立后的检查
  // 当出现自连接的情况后，要将链接断开
  function connectionBeforeDropCheck (info) {
    if (!info.connection.source.dataset.pid) {
      return true
    }
    return info.connection.source.dataset.pid !== info.connection.target.dataset.id
  }

  // 获取基本配置
  function getBaseNodeConfig () {
    return Object.assign({}, visoConfig.baseStyle)
  }

  // 初始化开始节点属性
  function initBeginNode (id) {
    var config = getBaseNodeConfig()

    config.isTarget = false
    config.maxConnections = 1

    jsPlumb.addEndpoint(id, {
      anchors: 'Bottom',
      uuid: id + '-out'
    }, config)
  }

  // 初始化结束节点属性
  function initEndNode (id) {
    var config = getBaseNodeConfig()

    config.isSource = false

    jsPlumb.addEndpoint(id, {
      anchors: 'Top',
      uuid: id + '-in'
    }, config)
  }

  var DataProcess = {
    inputData: function (nodes) {
      var ids = this.getNodeIds(nodes)
      var g = new graphlib.Graph()

      ids.forEach(function (id) {
        g.setNode(id)
      })

      var me = this

      nodes.forEach(function (item) {
        if (me['dealNode' + item.type]) {
          me['dealNode' + item.type](g, item)
        } else {
          console.error('have no deal node of ' + item.type)
        }
      })

      console.log(g.nodes())
      var distance = graphlib.alg.dijkstra(g, 'Start')

      return this.generateDepth(distance)
    },
    setNodesPosition: function (nodes) {
      var me = this
      nodes.forEach(function (item) {
        me.getNodePosition(item)
      })
    },
    getNodePosition: function (node) {
      var $node = document.getElementById(node.id)
      node.top = parseInt($node.style.top)
      node.left = parseInt($node.style.left)
    },
    generateDepth: function (deep) {
      var depth = []

      Object.keys(deep).forEach(function (key) {
        var distance = deep[key].distance

        if (!depth[distance]) {
          depth[distance] = []
        }

        depth[distance].push(key)
      })

      return depth
    },
    getNodeIds: function (nodes) {
      return nodes.map(function (item) {
        return item.id
      })
    },
    dealNodeRoot: function (g, node) {
      this.setEdge(g, node.id, node.data.nextNode)
    },
    dealNodeAnnounce: function (g, node) {
      this.setEdge(g, node.id, node.data.nextNode)
    },
    dealNodeExit: function (g, node) {

    },
    dealNodeWorkTime: function (g, node) {
      this.setEdge(g, node.id, node.data.onWorkNode)
      this.setEdge(g, node.id, node.data.offWorkNode)
    },
    dealNodeMenu: function (g, node) {
      this.setEdge(g, node.id, node.data.nextNode)
    },
    setEdge: function name (g, from, to) {
      console.log(from + ' ---> ' + to)
      g.setEdge(from, to)
    }
  }

  var DataDraw = {
    deleteLine: function (conn) {
      if (confirm('确定删除所点击的链接吗？')) {
        jsPlumb.detach(conn)
      }
    },
    draw: function (nodes) {
      // 将Exit节点排到最后
      nodes.sort(function (a, b) {
        if (a.type === 'Exit') return 1
        if (b.type === 'Exit') return -1
        return 0
      })

      this.computeXY(nodes)

      // var template = $('#tpl-demo').html()
      var $container = $(areaId)
      var me = this

      nodes.forEach(function (item, key) {
        console.log(item)
        console.log(typeof key)

        var data = {
          id: item.id,
          name: item.id,
          top: item.top,
          left: item.left,
          choices: item.data.choices || []
        }

        console.log(data)
        var template = me.getTemplate(item)

        $container.append(Mustache.render(template, data))

        if (me['addEndpointOf' + item.type]) {
          me['addEndpointOf' + item.type](item)
        }
      })

      this.mainConnect(nodes)
    },
    connectEndpoint: function (from, to) {
      jsPlumb.connect({ uuids: [from, to] })
    },
    mainConnect: function (nodes) {
      var me = this
      nodes.forEach(function (item) {
        if (me['connectEndpointOf' + item.type]) {
          me['connectEndpointOf' + item.type](item)
        }
      })
    },
    getTemplate: function (node) {
      return $('#tpl-' + node.type).html() || $('#tpl-demo').html()
    },
    computeXY: function (nodes) {
      var matrix = DataProcess.inputData(nodes)

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
    },
    addEndpointOfRoot: function (node) {
      addDraggable(node.id)
      initBeginNode(node.id)
    },
    connectEndpointOfRoot: function (node) {
      this.connectEndpoint(node.id + '-out', node.data.nextNode + '-in')
    },
    addEndpointOfExit: function (node) {
      addDraggable(node.id)
      initEndNode(node.id)
    },
    addEndpointOfAnnounce: function (node) {
      addDraggable(node.id)
      setEnterPoint(node.id)
      setExitPoint(node.id)
    },
    connectEndpointOfAnnounce: function (node) {
      this.connectEndpoint(node.id + '-out', node.data.nextNode + '-in')
    },
    addEndpointOfWorkTime: function (node) {
      addDraggable(node.id)
      setEnterPoint(node.id)

      var ids = ['onWorkTime', 'offWorkTime']

      ids.forEach(function (key) {
        setExitPoint(node.id + '-' + key, 'Right')
      })
    },
    connectEndpointOfWorkTime: function (node) {
      this.connectEndpoint(node.id + '-onWorkTime-out', node.data.onWorkNode + '-in')
      this.connectEndpoint(node.id + '-offWorkTime-out', node.data.offWorkNode + '-in')
    },
    addEndpointOfMenu: function (node) {
      addDraggable(node.id)
      setEnterPoint(node.id)

      var ids = ['noinput', 'nomatch']

      node.data.choices.forEach(function (item) {
        ids.push('key-' + item.key)
      })

      ids.forEach(function (key) {
        setExitPoint(node.id + '-' + key, 'Right')
      })
    },
    connectEndpointOfMenu: function (node) {
      this.connectEndpoint(node.id + '-noinput-out', node.data.noinput.nextNode + '-in')
      this.connectEndpoint(node.id + '-nomatch-out', node.data.nomatch.nextNode + '-in')

      var me = this

      node.data.choices.forEach(function (item) {
        me.connectEndpoint(node.id + '-key-' + item.key + '-out', item.nextNode + '-in')
      })
    }
  }

  root.DataProcess = DataProcess
  root.DataDraw = DataDraw
})()
