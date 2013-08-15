;(function(context) {

    var MoreThanAnImage = context.MoreThanAnImage = function() {
    };

    MoreThanAnImage.load = function(url, callback) {
        var supportsResponseType = typeof new XMLHttpRequest().responseType === 'string';
        if (supportsResponseType) {
            loadViaBlob(url, function(error, response) {
                callback(error, response);
            });
        }
        else {
            loadForIE9(url, function(error, response) {
                callback(error, response);
            });
        }
    };

    function parseHeaders(xhr) {
        var parsedHeaders = {},
            headerString = xhr.getAllResponseHeaders(),
            headers = headerString.split('\n');
        for (var i=0; i<headers.length; ++i) {
            if (/^\s*$/.test(headers[i])) {
                continue;
            }
            var keyValue = headers[i].split(': ');
            parsedHeaders[keyValue[0].toLowerCase()] = keyValue[1];
        }
        return parsedHeaders;
    }

    function loadViaBlob(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (xhr.status !== 200) {
                callback({ status: xhr.status });
                return;
            }
            
            var blob = xhr.response;
            var image = document.createElement('img');
            image.addEventListener('load', function (evt) {
                URL.revokeObjectURL(evt.target.src);

                callback(null, {
                    image: image,
                    headers: parseHeaders(xhr)
                });
            });
            image.src = URL.createObjectURL(blob);
        };

        xhr.onerror = function() {
            callback({});
            console.log('on error');
        };
        xhr.open('GET', url, true);
        xhr.send();
    }

    function loadForIE9(url, callback) {

        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            if (xhr.status !== 200) {
                callback({ status: xhr.status });
                return;
            }
            
            var image = document.createElement('img');
            image.addEventListener('load', function (evt) {
                callback(null, {
                    image: image,
                    headers: parseHeaders(xhr)
                });
            });

            // From: http://emilsblog.lerch.org/2009/07/javascript-hacks-using-xhr-to-load.html
            var data = new VBArray(xhr.responseBody).toArray();
            image.src='data:imagejpeg;base64,' + encode64Array(data);
        };

        xhr.onerror = function() {
            callback({});
            console.log('on error');
        };

        xhr.open('GET', url, true);
        xhr.send();
    }

    // From: http://www.philten.com/us-xmlhttprequest-image/
    function encode64Array(input) {
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            outputStr = '',
            i = 0;
        
        while (i<input.length) {
            //all three "& 0xff" added below are there to fix a known bug 
            //with bytes returned by xhr.responseText
            var byte1 = input[i++] & 0xff;
            var byte2 = input[i++] & 0xff;
            var byte3 = input[i++] & 0xff;

            var enc1 = byte1 >> 2;
            var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
            
            var enc3, enc4;
            if (isNaN(byte2)) {
                enc3 = enc4 = 64;
            }
            else {
                enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                if (isNaN(byte3)) {
                    enc4 = 64;
                }
                else {
                    enc4 = byte3 & 63;
                }
            }
            outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
        }
        return outputStr;
    }

})(window);