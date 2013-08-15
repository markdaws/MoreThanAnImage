MoreThanAnImage
===============

#Overview
Sometimes you want more than just an image, potentially an image plus some associated metadata, rather than
having to call an API to fetch the metadata embed it directly in HTTP headers associated with the image. By
doing this you can immediately show information without having to wait for API calls, plus if you are hosting
images on a CDN or some other service, you can eliminate having the overhead of managing the extra APIs.

##Example usage
```javascript
    var url = '/google.jpg';
    var loadRequest = MoreThanAnImage.load(url, function(error, response) {
        if(error) {
            alert('got an error:' + error.status);
            return;
        }
        $('#imageContainer').append(response.image);

        var htmlString = '';
        for(var key in response.headers) {
            htmlString += key + ' => ' + response.headers[key] + '<br />';
        }
        $('#headerContainer').append('<p>' + htmlString + '</p>');
    });
```

##Demo
Click on the <a href="http://markdaws.github.io/MoreThanAnImage">link</a> to see a live demo, an image should load and show the associated HTTP headers.

##Cross domain
Since the code uses an XmlHttpRequest object, you will need to setup the CORS response on your server. For example,
here is how you setup CORS on <a href="http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html">Amazon</a>.

NOTE: CORS is supported by IE10 and up, this won;t work on IE9, if anyone knows a workaround (yes I tried
XDomainRequest, but it doesn't support binary content only text "face palm".

##Future TODOs:
1. Support EXIF parsing
2. Add download progress information

##Development
You don't need to install npm (npmjs.org) but you can use it to host a mini webserver for development:

```bash
git clone git@github.com:markdaws/MoreThanAnImage.git
cd MoreThanAnImage
npm install
npm start

open http://localhost:9999/demo/index.html
```
