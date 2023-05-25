module.exports = [
  {
    url: '/api/account/token/',
    type: 'POST',
    response: req => {
      return {
        r: 0,
        e: '',
        data: {
          global_public_key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCoM3uc0N3shJjQNlUhmfWZJIwsCi9RQj7nsIiMEG9ZjrrcdAKgp5RI57N+Qfk5/SGLLOGuXOcXbp1tJ0/ayQVhpywZfoVwiyGudBNfz1BGiK+3hX3xNorseNgNak4ZOQ3NQY/+jHnsJwJz9O9oJkgXOoq0dHIoz3X2bmJpOACnxwIDAQAB',
          public_key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDcFGYvfskG+jEmJTrcybPzNLeouw7dRcc5N0Nic3F4hWplREcQFIVX3vdS7VONRR++mS8HMQ35xmIMLOQFJqZfVM+BmAB22ObLfrR89ufFfvWxXZPvlnbBivKc6Df2/WjA8f1QvtaJPq1JKx957nvkUnWW2Ulj9THOjdw/cm6yQIDAQAB',
          salt: '1675859220'
        }
      }
    }
  }
]
