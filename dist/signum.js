(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.signum = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(){
  return Signum;
}

var Signum = new function() {
    this.ws = undefined;
    this.conected = false;
    this.sessionId = undefined;
    this.events = new Events();    
    var self = this;

    this.open = function(url,licenceKey,callback,errorCallback){
      $.ajax({
        type: "POST",
        url: url + '/session/new',
        data: {licenceKey: licenceKey},
        success: function(data){
          self.sessionId = data.response_object.id;
          self.openSocket(url,callback,errorCallback);
        },
        error: function () {
          errorCallback({error_code:1,error_mensagem: 'Nao foi possivel estabelecer conexao com signum'})
        }
      });
    }

    this.openSocket = function (url,callback,errorCallback) {
      
      self.ws = new WebSocket(url.replace("http","ws") + '/signum');

      self.ws.onopen = function() {
        self.conected = true;
        self.events.emit("signum_connection_opened");
        callback();
      };
      
      this.ws.onmessage = function(e) {
        self.events.emit("signum_onmessage",e.data);
        
        var msg = JSON.parse(e.data);
        
        if(msg.response_id == 'new_session'){
            self.events.emit("signum_new_session",msg);
            self.sessionId = msg.response_object.id;
        }else if(msg.response_id == 'list_ok'){
            self.events.emit("signum_list_ok",msg);
        }else if(msg.response_id == 'hello'){
            self.events.emit("signum_hello",msg);
        }else if(msg.response_id == 'signum_list_in_processing'){
            self.events.emit("signum_list_in_processing",msg);
        }else if(msg.response_id == 'login_ok'){
            self.events.emit("signum_login_ok",msg);
        } else if (msg.response_id == 'sign_ok') {
            self.events.emit("signum_sign_ok", msg);
        }else if(msg.response_id == 'pin_requested'){
          self.events.emit("signum_pin_requested",msg);
        }else if(msg.response_id == 'error'){
          self.events.emit("signum_error",msg);
          errorCallback(msg);
        }
      };
      
      this.ws.onclose = function() {
        self.conected = false;
        self.events.emit("signum_connection_closed");
      };    
    
    };
    
    this.new_session = function(callback){
      self.ws.send('{"message_id":"new_session","session_id":"'+ self.sessionId +'"}');
      self.events.on("signum_new_session",callback);
      
    };
    this.use_session = function(session_id){};

    this.list = function(pinCallback,listCallback){
      self.ws.send('{"message_id":"list","session_id":"'+ self.sessionId +'"}');
      self.events.on("signum_pin_requested",pinCallback);
      self.events.on("signum_list_ok",listCallback);
    };

    this.load_a1 = function(content,pin,callback){
      self.ws.send('{"message_id":"load_a1","session_id":"'+ self.sessionId +'","content":"' + content + '","pin":"'+ pin +'"}');
      self.events.on("signum_list_ok",callback);
    };

    this.login = function(){};

    this.hello = function(callback){
      self.ws.send('{"message_id":"hello","session_id":"'+ self.sessionId +'"}');
      self.events.on("signum_hello",callback);
    };    
    
    this.setPin = function(pin){
      self.ws.send('{"message_id":"pin","session_id":"'+ self.sessionId +'","pin":"' + pin + '"}');
    };
    
    this.login = function(alias,token,callback){
      self.events.on("signum_login_ok",callback);
      self.ws.send('{"message_id":"login","session_id":"'+ self.sessionId +'","alias":"' + alias + '","token":"'+ token +'"}');
    }

    this.sign = function(alias,content,contentName,contentId,callback){
      self.events.on("signum_sign_ok",callback);
      self.ws.send('{"message_id":"sign","session_id":"'+ self.sessionId +'","alias":"' + alias + '","content":"'+ content +'","content_name":"'+ contentName +'","content_id":"'+ contentId +'"}');
    }

}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjUuMTAuMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gU2lnbnVtO1xufVxuXG52YXIgU2lnbnVtID0gbmV3IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud3MgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2Vzc2lvbklkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50cygpOyAgICBcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLm9wZW4gPSBmdW5jdGlvbih1cmwsbGljZW5jZUtleSxjYWxsYmFjayxlcnJvckNhbGxiYWNrKXtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICB1cmw6IHVybCArICcvc2Vzc2lvbi9uZXcnLFxuICAgICAgICBkYXRhOiB7bGljZW5jZUtleTogbGljZW5jZUtleX0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIHNlbGYuc2Vzc2lvbklkID0gZGF0YS5yZXNwb25zZV9vYmplY3QuaWQ7XG4gICAgICAgICAgc2VsZi5vcGVuU29ja2V0KHVybCxjYWxsYmFjayxlcnJvckNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBlcnJvckNhbGxiYWNrKHtlcnJvcl9jb2RlOjEsZXJyb3JfbWVuc2FnZW06ICdOYW8gZm9pIHBvc3NpdmVsIGVzdGFiZWxlY2VyIGNvbmV4YW8gY29tIHNpZ251bSd9KVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLm9wZW5Tb2NrZXQgPSBmdW5jdGlvbiAodXJsLGNhbGxiYWNrLGVycm9yQ2FsbGJhY2spIHtcbiAgICAgIFxuICAgICAgc2VsZi53cyA9IG5ldyBXZWJTb2NrZXQodXJsLnJlcGxhY2UoXCJodHRwXCIsXCJ3c1wiKSArICcvc2lnbnVtJyk7XG5cbiAgICAgIHNlbGYud3Mub25vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuY29uZWN0ZWQgPSB0cnVlO1xuICAgICAgICBzZWxmLmV2ZW50cy5lbWl0KFwic2lnbnVtX2Nvbm5lY3Rpb25fb3BlbmVkXCIpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgdGhpcy53cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1fb25tZXNzYWdlXCIsZS5kYXRhKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBtc2cgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICAgIFxuICAgICAgICBpZihtc2cucmVzcG9uc2VfaWQgPT0gJ25ld19zZXNzaW9uJyl7XG4gICAgICAgICAgICBzZWxmLmV2ZW50cy5lbWl0KFwic2lnbnVtX25ld19zZXNzaW9uXCIsbXNnKTtcbiAgICAgICAgICAgIHNlbGYuc2Vzc2lvbklkID0gbXNnLnJlc3BvbnNlX29iamVjdC5pZDtcbiAgICAgICAgfWVsc2UgaWYobXNnLnJlc3BvbnNlX2lkID09ICdsaXN0X29rJyl7XG4gICAgICAgICAgICBzZWxmLmV2ZW50cy5lbWl0KFwic2lnbnVtX2xpc3Rfb2tcIixtc2cpO1xuICAgICAgICB9ZWxzZSBpZihtc2cucmVzcG9uc2VfaWQgPT0gJ2hlbGxvJyl7XG4gICAgICAgICAgICBzZWxmLmV2ZW50cy5lbWl0KFwic2lnbnVtX2hlbGxvXCIsbXNnKTtcbiAgICAgICAgfWVsc2UgaWYobXNnLnJlc3BvbnNlX2lkID09ICdzaWdudW1fbGlzdF9pbl9wcm9jZXNzaW5nJyl7XG4gICAgICAgICAgICBzZWxmLmV2ZW50cy5lbWl0KFwic2lnbnVtX2xpc3RfaW5fcHJvY2Vzc2luZ1wiLG1zZyk7XG4gICAgICAgIH1lbHNlIGlmKG1zZy5yZXNwb25zZV9pZCA9PSAnbG9naW5fb2snKXtcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1fbG9naW5fb2tcIixtc2cpO1xuICAgICAgICB9IGVsc2UgaWYgKG1zZy5yZXNwb25zZV9pZCA9PSAnc2lnbl9vaycpIHtcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1fc2lnbl9va1wiLCBtc2cpO1xuICAgICAgICB9ZWxzZSBpZihtc2cucmVzcG9uc2VfaWQgPT0gJ3Bpbl9yZXF1ZXN0ZWQnKXtcbiAgICAgICAgICBzZWxmLmV2ZW50cy5lbWl0KFwic2lnbnVtX3Bpbl9yZXF1ZXN0ZWRcIixtc2cpO1xuICAgICAgICB9ZWxzZSBpZihtc2cucmVzcG9uc2VfaWQgPT0gJ2Vycm9yJyl7XG4gICAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9lcnJvclwiLG1zZyk7XG4gICAgICAgICAgZXJyb3JDYWxsYmFjayhtc2cpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgXG4gICAgICB0aGlzLndzLm9uY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5jb25lY3RlZCA9IGZhbHNlO1xuICAgICAgICBzZWxmLmV2ZW50cy5lbWl0KFwic2lnbnVtX2Nvbm5lY3Rpb25fY2xvc2VkXCIpO1xuICAgICAgfTsgICAgXG4gICAgXG4gICAgfTtcbiAgICBcbiAgICB0aGlzLm5ld19zZXNzaW9uID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgc2VsZi53cy5zZW5kKCd7XCJtZXNzYWdlX2lkXCI6XCJuZXdfc2Vzc2lvblwiLFwic2Vzc2lvbl9pZFwiOlwiJysgc2VsZi5zZXNzaW9uSWQgKydcIn0nKTtcbiAgICAgIHNlbGYuZXZlbnRzLm9uKFwic2lnbnVtX25ld19zZXNzaW9uXCIsY2FsbGJhY2spO1xuICAgICAgXG4gICAgfTtcbiAgICB0aGlzLnVzZV9zZXNzaW9uID0gZnVuY3Rpb24oc2Vzc2lvbl9pZCl7fTtcblxuICAgIHRoaXMubGlzdCA9IGZ1bmN0aW9uKHBpbkNhbGxiYWNrLGxpc3RDYWxsYmFjayl7XG4gICAgICBzZWxmLndzLnNlbmQoJ3tcIm1lc3NhZ2VfaWRcIjpcImxpc3RcIixcInNlc3Npb25faWRcIjpcIicrIHNlbGYuc2Vzc2lvbklkICsnXCJ9Jyk7XG4gICAgICBzZWxmLmV2ZW50cy5vbihcInNpZ251bV9waW5fcmVxdWVzdGVkXCIscGluQ2FsbGJhY2spO1xuICAgICAgc2VsZi5ldmVudHMub24oXCJzaWdudW1fbGlzdF9va1wiLGxpc3RDYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHRoaXMubG9hZF9hMSA9IGZ1bmN0aW9uKGNvbnRlbnQscGluLGNhbGxiYWNrKXtcbiAgICAgIHNlbGYud3Muc2VuZCgne1wibWVzc2FnZV9pZFwiOlwibG9hZF9hMVwiLFwic2Vzc2lvbl9pZFwiOlwiJysgc2VsZi5zZXNzaW9uSWQgKydcIixcImNvbnRlbnRcIjpcIicgKyBjb250ZW50ICsgJ1wiLFwicGluXCI6XCInKyBwaW4gKydcIn0nKTtcbiAgICAgIHNlbGYuZXZlbnRzLm9uKFwic2lnbnVtX2xpc3Rfb2tcIixjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbigpe307XG5cbiAgICB0aGlzLmhlbGxvID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgc2VsZi53cy5zZW5kKCd7XCJtZXNzYWdlX2lkXCI6XCJoZWxsb1wiLFwic2Vzc2lvbl9pZFwiOlwiJysgc2VsZi5zZXNzaW9uSWQgKydcIn0nKTtcbiAgICAgIHNlbGYuZXZlbnRzLm9uKFwic2lnbnVtX2hlbGxvXCIsY2FsbGJhY2spO1xuICAgIH07ICAgIFxuICAgIFxuICAgIHRoaXMuc2V0UGluID0gZnVuY3Rpb24ocGluKXtcbiAgICAgIHNlbGYud3Muc2VuZCgne1wibWVzc2FnZV9pZFwiOlwicGluXCIsXCJzZXNzaW9uX2lkXCI6XCInKyBzZWxmLnNlc3Npb25JZCArJ1wiLFwicGluXCI6XCInICsgcGluICsgJ1wifScpO1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uKGFsaWFzLHRva2VuLGNhbGxiYWNrKXtcbiAgICAgIHNlbGYuZXZlbnRzLm9uKFwic2lnbnVtX2xvZ2luX29rXCIsY2FsbGJhY2spO1xuICAgICAgc2VsZi53cy5zZW5kKCd7XCJtZXNzYWdlX2lkXCI6XCJsb2dpblwiLFwic2Vzc2lvbl9pZFwiOlwiJysgc2VsZi5zZXNzaW9uSWQgKydcIixcImFsaWFzXCI6XCInICsgYWxpYXMgKyAnXCIsXCJ0b2tlblwiOlwiJysgdG9rZW4gKydcIn0nKTtcbiAgICB9XG5cbiAgICB0aGlzLnNpZ24gPSBmdW5jdGlvbihhbGlhcyxjb250ZW50LGNvbnRlbnROYW1lLGNvbnRlbnRJZCxjYWxsYmFjayl7XG4gICAgICBzZWxmLmV2ZW50cy5vbihcInNpZ251bV9zaWduX29rXCIsY2FsbGJhY2spO1xuICAgICAgc2VsZi53cy5zZW5kKCd7XCJtZXNzYWdlX2lkXCI6XCJzaWduXCIsXCJzZXNzaW9uX2lkXCI6XCInKyBzZWxmLnNlc3Npb25JZCArJ1wiLFwiYWxpYXNcIjpcIicgKyBhbGlhcyArICdcIixcImNvbnRlbnRcIjpcIicrIGNvbnRlbnQgKydcIixcImNvbnRlbnRfbmFtZVwiOlwiJysgY29udGVudE5hbWUgKydcIixcImNvbnRlbnRfaWRcIjpcIicrIGNvbnRlbnRJZCArJ1wifScpO1xuICAgIH1cblxufVxuIl19
