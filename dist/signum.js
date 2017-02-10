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
        } else if (msg.response_id == 'sign_xml_ok') {
            self.events.emit("signum_sign_xml_ok", msg);
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
    
    this.sign_xml = function(alias,content,contentName,contentId,callback){
      self.events.on("signum_sign_xml_ok",callback);
      self.ws.send('{"message_id":"sign_xml","session_id":"'+ self.sessionId +'","alias":"' + alias + '","content":"'+ content +'","content_name":"'+ contentName +'","content_id":"'+ contentId +'"}');
    }

}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjUuMTAuMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBTaWdudW07XG59XG5cbnZhciBTaWdudW0gPSBuZXcgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy53cyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNvbmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5zZXNzaW9uSWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRzKCk7ICAgIFxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMub3BlbiA9IGZ1bmN0aW9uKHVybCxsaWNlbmNlS2V5LGNhbGxiYWNrLGVycm9yQ2FsbGJhY2spe1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgIHVybDogdXJsICsgJy9zZXNzaW9uL25ldycsXG4gICAgICAgIGRhdGE6IHtsaWNlbmNlS2V5OiBsaWNlbmNlS2V5fSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgc2VsZi5zZXNzaW9uSWQgPSBkYXRhLnJlc3BvbnNlX29iamVjdC5pZDtcbiAgICAgICAgICBzZWxmLm9wZW5Tb2NrZXQodXJsLGNhbGxiYWNrLGVycm9yQ2FsbGJhY2spO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGVycm9yQ2FsbGJhY2soe2Vycm9yX2NvZGU6MSxlcnJvcl9tZW5zYWdlbTogJ05hbyBmb2kgcG9zc2l2ZWwgZXN0YWJlbGVjZXIgY29uZXhhbyBjb20gc2lnbnVtJ30pXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMub3BlblNvY2tldCA9IGZ1bmN0aW9uICh1cmwsY2FsbGJhY2ssZXJyb3JDYWxsYmFjaykge1xuICAgICAgXG4gICAgICBzZWxmLndzID0gbmV3IFdlYlNvY2tldCh1cmwucmVwbGFjZShcImh0dHBcIixcIndzXCIpICsgJy9zaWdudW0nKTtcblxuICAgICAgc2VsZi53cy5vbm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5jb25lY3RlZCA9IHRydWU7XG4gICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1fY29ubmVjdGlvbl9vcGVuZWRcIik7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9O1xuICAgICAgXG4gICAgICB0aGlzLndzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9vbm1lc3NhZ2VcIixlLmRhdGEpO1xuICAgICAgICBcbiAgICAgICAgdmFyIG1zZyA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgICAgXG4gICAgICAgIGlmKG1zZy5yZXNwb25zZV9pZCA9PSAnbmV3X3Nlc3Npb24nKXtcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1fbmV3X3Nlc3Npb25cIixtc2cpO1xuICAgICAgICAgICAgc2VsZi5zZXNzaW9uSWQgPSBtc2cucmVzcG9uc2Vfb2JqZWN0LmlkO1xuICAgICAgICB9ZWxzZSBpZihtc2cucmVzcG9uc2VfaWQgPT0gJ2xpc3Rfb2snKXtcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1fbGlzdF9va1wiLG1zZyk7XG4gICAgICAgIH1lbHNlIGlmKG1zZy5yZXNwb25zZV9pZCA9PSAnaGVsbG8nKXtcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1faGVsbG9cIixtc2cpO1xuICAgICAgICB9ZWxzZSBpZihtc2cucmVzcG9uc2VfaWQgPT0gJ3NpZ251bV9saXN0X2luX3Byb2Nlc3NpbmcnKXtcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1fbGlzdF9pbl9wcm9jZXNzaW5nXCIsbXNnKTtcbiAgICAgICAgfWVsc2UgaWYobXNnLnJlc3BvbnNlX2lkID09ICdsb2dpbl9vaycpe1xuICAgICAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9sb2dpbl9va1wiLG1zZyk7XG4gICAgICAgIH0gZWxzZSBpZiAobXNnLnJlc3BvbnNlX2lkID09ICdzaWduX29rJykge1xuICAgICAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9zaWduX29rXCIsIG1zZyk7XG4gICAgICAgIH0gZWxzZSBpZiAobXNnLnJlc3BvbnNlX2lkID09ICdzaWduX3htbF9vaycpIHtcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1fc2lnbl94bWxfb2tcIiwgbXNnKTtcbiAgICAgICAgfWVsc2UgaWYobXNnLnJlc3BvbnNlX2lkID09ICdwaW5fcmVxdWVzdGVkJyl7XG4gICAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9waW5fcmVxdWVzdGVkXCIsbXNnKTtcbiAgICAgICAgfWVsc2UgaWYobXNnLnJlc3BvbnNlX2lkID09ICdlcnJvcicpe1xuICAgICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1fZXJyb3JcIixtc2cpO1xuICAgICAgICAgIGVycm9yQ2FsbGJhY2sobXNnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIFxuICAgICAgdGhpcy53cy5vbmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuY29uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9jb25uZWN0aW9uX2Nsb3NlZFwiKTtcbiAgICAgIH07ICAgIFxuICAgIFxuICAgIH07XG4gICAgXG4gICAgdGhpcy5uZXdfc2Vzc2lvbiA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgIHNlbGYud3Muc2VuZCgne1wibWVzc2FnZV9pZFwiOlwibmV3X3Nlc3Npb25cIixcInNlc3Npb25faWRcIjpcIicrIHNlbGYuc2Vzc2lvbklkICsnXCJ9Jyk7XG4gICAgICBzZWxmLmV2ZW50cy5vbihcInNpZ251bV9uZXdfc2Vzc2lvblwiLGNhbGxiYWNrKTtcbiAgICAgIFxuICAgIH07XG4gICAgdGhpcy51c2Vfc2Vzc2lvbiA9IGZ1bmN0aW9uKHNlc3Npb25faWQpe307XG5cbiAgICB0aGlzLmxpc3QgPSBmdW5jdGlvbihwaW5DYWxsYmFjayxsaXN0Q2FsbGJhY2spe1xuICAgICAgc2VsZi53cy5zZW5kKCd7XCJtZXNzYWdlX2lkXCI6XCJsaXN0XCIsXCJzZXNzaW9uX2lkXCI6XCInKyBzZWxmLnNlc3Npb25JZCArJ1wifScpO1xuICAgICAgc2VsZi5ldmVudHMub24oXCJzaWdudW1fcGluX3JlcXVlc3RlZFwiLHBpbkNhbGxiYWNrKTtcbiAgICAgIHNlbGYuZXZlbnRzLm9uKFwic2lnbnVtX2xpc3Rfb2tcIixsaXN0Q2FsbGJhY2spO1xuICAgIH07XG5cbiAgICB0aGlzLmxvYWRfYTEgPSBmdW5jdGlvbihjb250ZW50LHBpbixjYWxsYmFjayl7XG4gICAgICBzZWxmLndzLnNlbmQoJ3tcIm1lc3NhZ2VfaWRcIjpcImxvYWRfYTFcIixcInNlc3Npb25faWRcIjpcIicrIHNlbGYuc2Vzc2lvbklkICsnXCIsXCJjb250ZW50XCI6XCInICsgY29udGVudCArICdcIixcInBpblwiOlwiJysgcGluICsnXCJ9Jyk7XG4gICAgICBzZWxmLmV2ZW50cy5vbihcInNpZ251bV9saXN0X29rXCIsY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgdGhpcy5oZWxsbyA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgIHNlbGYud3Muc2VuZCgne1wibWVzc2FnZV9pZFwiOlwiaGVsbG9cIixcInNlc3Npb25faWRcIjpcIicrIHNlbGYuc2Vzc2lvbklkICsnXCJ9Jyk7XG4gICAgICBzZWxmLmV2ZW50cy5vbihcInNpZ251bV9oZWxsb1wiLGNhbGxiYWNrKTtcbiAgICB9OyAgICBcbiAgICBcbiAgICB0aGlzLnNldFBpbiA9IGZ1bmN0aW9uKHBpbil7XG4gICAgICBzZWxmLndzLnNlbmQoJ3tcIm1lc3NhZ2VfaWRcIjpcInBpblwiLFwic2Vzc2lvbl9pZFwiOlwiJysgc2VsZi5zZXNzaW9uSWQgKydcIixcInBpblwiOlwiJyArIHBpbiArICdcIn0nKTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbihhbGlhcyx0b2tlbixjYWxsYmFjayl7XG4gICAgICBzZWxmLmV2ZW50cy5vbihcInNpZ251bV9sb2dpbl9va1wiLGNhbGxiYWNrKTtcbiAgICAgIHNlbGYud3Muc2VuZCgne1wibWVzc2FnZV9pZFwiOlwibG9naW5cIixcInNlc3Npb25faWRcIjpcIicrIHNlbGYuc2Vzc2lvbklkICsnXCIsXCJhbGlhc1wiOlwiJyArIGFsaWFzICsgJ1wiLFwidG9rZW5cIjpcIicrIHRva2VuICsnXCJ9Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5zaWduID0gZnVuY3Rpb24oYWxpYXMsY29udGVudCxjb250ZW50TmFtZSxjb250ZW50SWQsY2FsbGJhY2spe1xuICAgICAgc2VsZi5ldmVudHMub24oXCJzaWdudW1fc2lnbl9va1wiLGNhbGxiYWNrKTtcbiAgICAgIHNlbGYud3Muc2VuZCgne1wibWVzc2FnZV9pZFwiOlwic2lnblwiLFwic2Vzc2lvbl9pZFwiOlwiJysgc2VsZi5zZXNzaW9uSWQgKydcIixcImFsaWFzXCI6XCInICsgYWxpYXMgKyAnXCIsXCJjb250ZW50XCI6XCInKyBjb250ZW50ICsnXCIsXCJjb250ZW50X25hbWVcIjpcIicrIGNvbnRlbnROYW1lICsnXCIsXCJjb250ZW50X2lkXCI6XCInKyBjb250ZW50SWQgKydcIn0nKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5zaWduX3htbCA9IGZ1bmN0aW9uKGFsaWFzLGNvbnRlbnQsY29udGVudE5hbWUsY29udGVudElkLGNhbGxiYWNrKXtcbiAgICAgIHNlbGYuZXZlbnRzLm9uKFwic2lnbnVtX3NpZ25feG1sX29rXCIsY2FsbGJhY2spO1xuICAgICAgc2VsZi53cy5zZW5kKCd7XCJtZXNzYWdlX2lkXCI6XCJzaWduX3htbFwiLFwic2Vzc2lvbl9pZFwiOlwiJysgc2VsZi5zZXNzaW9uSWQgKydcIixcImFsaWFzXCI6XCInICsgYWxpYXMgKyAnXCIsXCJjb250ZW50XCI6XCInKyBjb250ZW50ICsnXCIsXCJjb250ZW50X25hbWVcIjpcIicrIGNvbnRlbnROYW1lICsnXCIsXCJjb250ZW50X2lkXCI6XCInKyBjb250ZW50SWQgKydcIn0nKTtcbiAgICB9XG5cbn1cbiJdfQ==
