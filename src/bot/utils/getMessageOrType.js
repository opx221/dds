export default (message) => (
  message.text && `'${message.text}'`
  || message.voice && 'voice'
  || message.photo && 'photo'
  || message.document && 'document'
  || message.sticker && 'sticker'
  || `unknown type ${JSON.stringify(message, null, 2)}`
);
