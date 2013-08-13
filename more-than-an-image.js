$(document).ready(function() {


    function notLame() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", 'dog.jpeg', true);
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
            if (xhr.readyState == xhr.DONE) {
                var blob = xhr.response;
                //var image = //document.getElementById("my-image");
                
                var image = document.createElement('img');
                $('body').append(image);
                image.addEventListener("load", function (evt) {
                    URL.revokeObjectURL(evt.target.src);
                });
                image.src = URL.createObjectURL(blob);
                
                console.log(xhr.getResponseHeader('etag'));
            }
        };
        xhr.send();
    }

    function lame() {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", 'dog.jpeg', true);
        //xhr.responseType = "blob";
        xhr.overrideMimeType('text/plain; charset=x-user-defined'); 
        xhr.onreadystatechange = function () {
            if (xhr.readyState == xhr.DONE) {
                var image = document.createElement('img');

                console.time('encode');
                image.src="data:imagejpeg;base64," + encode64(xhr.responseText);
                console.timeEnd('encode');
                $('body').append(image);
                console.log(xhr.getResponseHeader('etag'));
            }
        };
        xhr.send();

        
    }

    //TODO: Fallback for no blob support ...

    lame();


// Fallback code from: http://www.philten.com/us-xmlhttprequest-image/

function encode64(inputStr) 
{
   var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   var outputStr = "";
   var i = 0;
   
   while (i<inputStr.length)
   {
      //all three "& 0xff" added below are there to fix a known bug 
      //with bytes returned by xhr.responseText
      var byte1 = inputStr.charCodeAt(i++) & 0xff;
      var byte2 = inputStr.charCodeAt(i++) & 0xff;
      var byte3 = inputStr.charCodeAt(i++) & 0xff;

      var enc1 = byte1 >> 2;
      var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
         
         var enc3, enc4;
         if (isNaN(byte2))
                {
                    enc3 = enc4 = 64;
                       }
         else
               {
                   enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                   if (isNaN(byte3))
                         {
           enc4 = 64;
                               }
                   else
                         {
                             enc4 = byte3 & 63;
                               }
                     }

      outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
   } 
   
   return outputStr;
}




});