export const parseKey = [
  {
    key: 'to',
    rename: 'partner',
    parse: 'to.value',
  },
  {
    key: 'from',
    parse: 'from.value',
  },
  {
    key: 'cc',
    rename: 'observer',
    parse: 'cc.value',
  },
  {
    key: 'subject',
    parse: 'subject',
  },
  {
    key: 'text',
    parse: 'text',
  },
  {
    key: 'textAsHtml',
    rename: 'html',
    parse: 'textAsHtml',
  },
  {
    key: 'messageId',
    parse: 'messageId',
  },
  {
    key: 'inReplyTo',
    rename: 'replyId',
    parse: 'inReplyTo',
  },
];
