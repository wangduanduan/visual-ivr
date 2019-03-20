/* global $, IVR */
function batchCreatAjaxApi (conf) {
  var api = {
    $headers: {}
  }
  var util = {
    fire: function (pathParm, payload) {
      return util.sendRequest({
        path: util.render(this.path, pathParm),
        method: this.method || 'get',
        payload: payload,
        contentType: this.contentType || 'application/json; charset=UTF-8'
      })
    },
    render: function (tpl, data) {
      var re = /{{([^}]+)?}}/
      var match = ''

      while ((match = re.exec(tpl))) {
        tpl = tpl.replace(match[0], data[match[1]])
      }
      return tpl
    },
    sendRequest: function (parm) {
      return $.ajax({
        url: conf.baseUrl + parm.path,
        type: parm.method,
        headers: api.$headers,
        data: parm.contentType.indexOf('json') >= 0 ? JSON.stringify(parm.payload) : parm.payload,
        dataType: 'json',
        contentType: parm.contentType
      })
    }
  }

  conf.pathList.forEach(function (item) {
    api[item.name] = item
    api[item.name].fire = util.fire
  })

  return api
}

// 下面是使用方法

var config = {
  baseUrl: 'http://192.168.40.231:30412',
  pathList: [
    {
      name: 'login',
      path: '/api/security/loginByEmail',
      method: 'post',
      contentType: 'application/x-www-form-urlencoded;charset-utf-8'
    },
    {
      name: 'queryResultByCallId',
      path: '/ocm/instant/query/{{callId}}',
      method: 'get'
    }
  ]
}

