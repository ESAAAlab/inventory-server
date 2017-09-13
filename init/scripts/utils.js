var crypto = require('crypto')

module.exports = {
  /* variableHash - Generate a variable-length hash of `data`.
  https://gist.github.com/bminer/4600432
  Similar to the answer here: http://crypto.stackexchange.com/a/3559/4829
  If you want a b-bit hash of the message m, then use the first b bits of AES-CTR(SHA256(m)).
  Rather than using the suggested algorithm in the stackexchange answer above, I developed
  my own.

  I decided to derive AES256 initialization vector and key from the output of SHA256(data).
  Then, the cipher is fed a zero-filled buffer as plaintext, which is encrypted using this key.
  The result should be a pseudorandom number generator seeded with a 256-bit hash of `data`.

  In other words, compute SHA256(m) and treat the resulting 256-bit string as a 256-bit AES key.
  Next, use AES in counter mode (with this key) to generate an unending stream of pseudorandom bits.
  Take the first b bits from this stream, and call it your hash.

  Returns a `Buffer` Object
  */
  variableHash: function (size, data, inputEncoding) {
    // Generate 256-bit hash of data
    var hash = crypto.createHash('sha256')
    hash.update(data, inputEncoding)
    hash = hash.digest('hex')
    // Generate pseudorandom-random output that is `size` bytes
    var output = Buffer.alloc(size)
    output.fill(0)
    // Encrypt a zero-filled buffer using the SHA-256 hash as the AES-256 key
    var cipher = crypto.createCipher('aes256', hash)
    var offset = output.write(cipher.update(output, 'utf8', 'base64'), 'binary')
    output.write(cipher.final('base64'), offset, 'binary')
    return output.toString()
  },

  /* Strip Accents from String */
  // https://gist.github.com/alisterlf/3490957
  removeAccents: function (str) {
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž'
    var accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz'
    str = str.split('')
    var strLen = str.length
    var i, x
    for (i = 0; i < strLen; i++) {
      if ((x = accents.indexOf(str[i])) !== -1) {
        str[i] = accentsOut[x]
      }
    }
    return str.join('')
  },

  getStudentYearId: function (year) {
    switch (year) {
      case 'Classe préparatoire':
        return 1
      case '1ère année':
        return 2
      case '2 art':
        return 3
      case '2 design':
        return 4
      case '3 art':
        return 5
      case '3 design':
        return 6
      case '4 art':
        return 7
      case '4 design':
        return 8
      case '5 art':
        return 9
      case '5 design':
        return 10
      default:
        return 11
    }
  },

  getStudentYear: function (year) {
    switch (year) {
      case 'Classe préparatoire':
        return 'Classe Préparatoire'
      case '1ère année':
        return '1ère Année'
      case '2 art':
        return '2ème Art'
      case '2 design':
        return '2ème Design'
      case '3 art':
        return '3ème Art'
      case '3 design':
        return '3ème Design'
      case '4 art':
        return '4ème Art'
      case '4 design':
        return '4ème Design'
      case '5 art':
        return '5ème Art'
      case '5 design':
        return '5ème Design'
      default:
        return 'Indéfinie'
    }
  }
}
