/* from https://github.com/andibrae/Reverb.js since a link won't work for requirejs
	had to do some edits to make it work
*/
define(function () {
	return {
		extend: function (audioContext) {
			function decodeBase64ToArrayBuffer(input) {
				function encodedValue(input, index) {
					var encodedCharacter,
						x = input.charCodeAt(index);
					return (
						index < input.length &&
							(x >= 65 && 90 >= x
								? (encodedCharacter = x - 65)
								: x >= 97 && 122 >= x
								? (encodedCharacter = x - 71)
								: x >= 48 && 57 >= x
								? (encodedCharacter = x + 4)
								: 43 === x
								? (encodedCharacter = 62)
								: 47 === x
								? (encodedCharacter = 63)
								: 61 !== x &&
								  console.log(
										'base64 encountered unexpected character code: ' +
											x
								  )),
						encodedCharacter
					);
				}
				if (0 === input.length || input.length % 4 > 0)
					return void console.log(
						'base64 encountered unexpected length: ' + input.length
					);
				for (
					var i,
						padding = input.match(/[=]*$/)[0].length,
						decodedLength = (3 * input.length) / 4 - padding,
						buffer = new ArrayBuffer(decodedLength),
						bufferView = new Uint8Array(buffer),
						encoded = [],
						d = 0,
						e = 0;
					decodedLength > d;

				) {
					for (i = 0; 4 > i; i += 1)
						(encoded[i] = encodedValue(input, e)), (e += 1);
					(bufferView[d] =
						4 * encoded[0] + Math.floor(encoded[1] / 16)),
						(d += 1),
						decodedLength > d &&
							((bufferView[d] =
								(encoded[1] % 16) * 16 +
								Math.floor(encoded[2] / 4)),
							(d += 1)),
						decodedLength > d &&
							((bufferView[d] =
								(encoded[2] % 4) * 64 + encoded[3]),
							(d += 1));
				}
				return buffer;
			}
			function decodeAndSetupBuffer(node, arrayBuffer, callback) {
				audioContext.decodeAudioData(
					arrayBuffer,
					function (audioBuffer) {
						console.log('Finished decoding audio data.'),
							(node.buffer = audioBuffer),
							'function' == typeof callback &&
								null !== audioBuffer &&
								callback(node);
					},
					function (e) {
						console.log('Could not decode audio data: ' + e);
					}
				);
			}
			(audioContext.createReverbFromBase64 = function (
				audioBase64,
				callback
			) {
				var reverbNode = audioContext.createConvolver();
				return (
					decodeAndSetupBuffer(
						reverbNode,
						decodeBase64ToArrayBuffer(audioBase64),
						callback
					),
					reverbNode
				);
			}),
				(audioContext.createSourceFromBase64 = function (
					audioBase64,
					callback
				) {
					var sourceNode = audioContext.createBufferSource();
					return (
						decodeAndSetupBuffer(
							sourceNode,
							decodeBase64ToArrayBuffer(audioBase64),
							callback
						),
						sourceNode
					);
				}),
				(audioContext.createReverbFromUrl = function (
					audioUrl,
					callback
				) {
					console.log(
						'Downloading impulse response from ' + audioUrl
					);
					var reverbNode = audioContext.createConvolver(),
						request = new XMLHttpRequest();
					return (
						request.open('GET', audioUrl, !0),
						(request.onreadystatechange = function () {
							4 === request.readyState &&
								200 === request.status &&
								(console.log('Downloaded impulse response'),
								decodeAndSetupBuffer(
									reverbNode,
									request.response,
									callback
								));
						}),
						(request.onerror = function (e) {
							console.log(
								'There was an error receiving the response: ' +
									e
							),
								(reverbjs.networkError = e);
						}),
						(request.responseType = 'arraybuffer'),
						request.send(),
						reverbNode
					);
				}),
				(audioContext.createSourceFromUrl = function (
					audioUrl,
					callback
				) {
					console.log('Downloading sound from ' + audioUrl);
					var sourceNode = audioContext.createBufferSource(),
						request = new XMLHttpRequest();
					return (
						request.open('GET', audioUrl, !0),
						(request.onreadystatechange = function () {
							4 === request.readyState &&
								200 === request.status &&
								(console.log('Downloaded sound'),
								decodeAndSetupBuffer(
									sourceNode,
									request.response,
									callback
								));
						}),
						(request.onerror = function (e) {
							console.log(
								'There was an error receiving the response: ' +
									e
							),
								(reverbjs.networkError = e);
						}),
						(request.responseType = 'arraybuffer'),
						request.send(),
						sourceNode
					);
				}),
				(audioContext.createReverbFromBase64Url = function (
					audioUrl,
					callback
				) {
					console.log(
						'Downloading base64 impulse response from ' + audioUrl
					);
					var reverbNode = audioContext.createConvolver(),
						request = new XMLHttpRequest();
					return (
						request.open('GET', audioUrl, !0),
						(request.onreadystatechange = function () {
							4 === request.readyState &&
								200 === request.status &&
								(console.log('Downloaded impulse response'),
								decodeAndSetupBuffer(
									reverbNode,
									decodeBase64ToArrayBuffer(request.response),
									callback
								));
						}),
						(request.onerror = function (e) {
							console.log(
								'There was an error receiving the response: ' +
									e
							),
								(reverbjs.networkError = e);
						}),
						request.send(),
						reverbNode
					);
				}),
				(audioContext.createSourceFromBase64Url = function (
					audioUrl,
					callback
				) {
					console.log('Downloading base64 sound from ' + audioUrl);
					var sourceNode = audioContext.createBufferSource(),
						request = new XMLHttpRequest();
					return (
						request.open('GET', audioUrl, !0),
						(request.onreadystatechange = function () {
							4 === request.readyState &&
								200 === request.status &&
								(console.log('Downloaded sound'),
								decodeAndSetupBuffer(
									sourceNode,
									decodeBase64ToArrayBuffer(request.response),
									callback
								));
						}),
						(request.onerror = function (e) {
							console.log(
								'There was an error receiving the response: ' +
									e
							),
								(reverbjs.networkError = e);
						}),
						request.send(),
						sourceNode
					);
				});
		},
	};
});
