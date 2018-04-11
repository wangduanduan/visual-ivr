var data = {
  'id': '4000',
  'name': '功能测试',
  'status': 'enable',
  'varList': [

  ],
  'nodeList': [
    {
      'id': 'Start',
      'type': 'Root',
      'comment': '开始',
      'status': '1',
      'data': {
        'nextNode': 'Announce'
      },
      'top': 50,
      'left': 150
    },
    {
      'id': 'Announce',
      'type': 'Announce',
      'comment': '语音节点',
      'status': '1',
      'data': {
        'nextNode': 'WorkTime',
        'prompts': [
          {
            'type': 'VOX',
            'value': 'api/file/download/nosession/90247cf3-eb3b-455e-97dd-714e2df5b47a.mp3'
          }
        ]
      },
      'top': 178,
      'left': 131
    },
    {
      'id': 'WorkTime',
      'type': 'WorkTime',
      'comment': '',
      'status': '1',
      'data': {
        'weekDay': '1,2,3,4,5',
        'workTime': '08:00~16:00',
        'onWorkNode': 'Menu',
        'offWorkNode': 'Menu2',
        'mDays': [
          {
            'date': '',
            'type': 'onWork'
          },
          {
            'date': '',
            'type': 'offWork'
          }
        ]
      },
      'top': 305,
      'left': 85
    },
    {
      'id': 'Menu',
      'type': 'Menu',
      'comment': '',
      'status': '1',
      'data': {
        'nextNode': 'Exit',
        'prompts': [
          {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        ],
        'noinput': {
          'timeout': '',
          'threshold': '',
          'nextNode': 'Exit',
          'prompt': {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        },
        'nomatch': {
          'threshold': '',
          'nextNode': 'Exit',
          'prompt': {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        },
        'choices': [
          {
            'key': '1',
            'nextNode': 'Exit'
          },
          {
            'key': '2',
            'nextNode': 'Exit'
          },
          {
            'key': '3',
            'nextNode': 'Exit'
          }
        ]
      },
      'top': 499,
      'left': 281
    },
    {
      'id': 'Menu2',
      'type': 'Menu',
      'comment': '',
      'status': '1',
      'data': {
        'nextNode': 'Exit',
        'prompts': [
          {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        ],
        'noinput': {
          'timeout': '',
          'threshold': '',
          'nextNode': 'Exit',
          'prompt': {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        },
        'nomatch': {
          'threshold': '',
          'nextNode': 'Exit',
          'prompt': {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        },
        'choices': [
          {
            'key': '1',
            'nextNode': 'Exit'
          },
          {
            'key': '2',
            'nextNode': 'Announce'
          }
        ]
      },
      'top': 330,
      'left': 503
    },
    {
      'id': 'Exit',
      'type': 'Exit',
      'status': '1',
      'comment': '结束',
      'data': {

      },
      'top': 829,
      'left': 883
    }
  ]
}
