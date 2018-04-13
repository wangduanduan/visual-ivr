export default {
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
