const handel = function (status) {
  let result = {
    type: 'error',
    msg: {
      en: 'Server error',
      cn: '服务器错误.'
    }
  }
  const code = parseInt(status)
  switch (code) {
    case 301:
      result = {
        type: 'warning',
        msg: {
          en: 'Request Fail，Moved Permanently',
          cn: '无法访问，服务器资源已被转移.'
        }
      }
      break;
    case 304:
      result = {
        type: 'warning',
        msg: {
          en: 'Request Fail，Not Modified',
          cn: '该请求已被缓存，禁止重复请求.'
        }
      }
      break;
    case 400:
      result = {
        type: 'error',
        msg: {
          en: 'Bad Request',
          cn: '请求错误，或请求参数有错误.'
        }
      }
      break;
    case 401:
      result = {
        type: 'warning',
        msg: {
          en: 'Request Unauthorized',
          cn: '请求失败，请求未带用户验证的token/session.'
        }
      }
      break;
    case 403:
      result = {
        type: 'error',
        msg: {
          en: 'Request Forbidden',
          cn: '请求失败，服务器拒绝了本次请求.'
        }
      }
      break;
    case 404:
      result = {
        type: 'error',
        msg: {
          en: 'Request Not Found',
          cn: '请求失败，未找到本次请求内容.'
        }
      }
      break;
    case 405:
      result = {
        type: 'error',
        msg: {
          en: 'Request Method Not Allowed',
          cn: '请求方式错误.'
        }
      }
      break;
    case 408:
      result = {
        type: 'error',
        msg: {
          en: 'Request Timeout',
          cn: '请求超时.'
        }
      }
      break;
    case 413:
      result = {
        type: 'error',
        msg: {
          en: 'Request Entity Too Large',
          cn: '请求参数过大.'
        }
      }
      break;
    case 414:
      result = {
        type: 'error',
        msg: {
          en: 'Request-URI Too Long',
          cn: '请求路径过长.'
        }
      }
      break;
    case 500:
      result = {
        type: 'error',
        msg: {
          en: 'Internal Server Error',
          cn: '服务器错误.'
        }
      }
      break;
    case 501:
      result = {
        type: 'error',
        msg: {
          en: 'Not Implemented',
          cn: '服务器不支持该请求.'
        }
      }
      break;
    case 502:
      result = {
        type: 'error',
        msg: {
          en: 'Bad Gateway',
          cn: '网关路由异常(禁止使用代理访问).'
        }
      }
      break;
    case 503:
      result = {
        type: 'error',
        msg: {
          en: 'Service Unavailable',
          cn: '服务器维护/过载，请稍后重试.'
        }
      }
      break;
    case 504:
      result = {
        type: 'error',
        msg: {
          en: 'Gateway Timeout',
          cn: '网关路由访问超时.'
        }
      }
      break;
    case 505:
      result = {
        type: 'error',
        msg: {
          en: 'HTTP Version Not Supported',
          cn: '服务器不支持当前HTTP版本或仅支持HTTPS访问.'
        }
      }
      break;
  }
  result.msg.en += `(Error Code：${code})`
  result.msg.cn += `(错误代码：${code})`
  return result
}

export default handel
