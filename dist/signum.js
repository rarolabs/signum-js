(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.signum = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log(new Events());

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
          console.log("Sessao criada")
          console.log(data)          
          self.sessionId = data.response_object.id;
          self.openSocket(url,callback,errorCallback);
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
        console.log("Mensagem recebida:" + e.data)
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
      self.events.on("sign_ok",callback);
      self.ws.send('{"message_id":"sign","session_id":"'+ self.sessionId +'","alias":"' + alias + '","content":"'+ content +'","content_name":"'+ contentName +'","content_id":"'+ contentId +'"}');
    }


}





},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zb2xlLmxvZyhuZXcgRXZlbnRzKCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBTaWdudW07XG59XG5cblxuXG52YXIgU2lnbnVtID0gbmV3IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud3MgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2Vzc2lvbklkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50cygpOyAgICBcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLm9wZW4gPSBmdW5jdGlvbih1cmwsbGljZW5jZUtleSxjYWxsYmFjayxlcnJvckNhbGxiYWNrKXtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICB1cmw6IHVybCArICcvc2Vzc2lvbi9uZXcnLFxuICAgICAgICBkYXRhOiB7bGljZW5jZUtleTogbGljZW5jZUtleX0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2Vzc2FvIGNyaWFkYVwiKVxuICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpICAgICAgICAgIFxuICAgICAgICAgIHNlbGYuc2Vzc2lvbklkID0gZGF0YS5yZXNwb25zZV9vYmplY3QuaWQ7XG4gICAgICAgICAgc2VsZi5vcGVuU29ja2V0KHVybCxjYWxsYmFjayxlcnJvckNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5vcGVuU29ja2V0ID0gZnVuY3Rpb24gKHVybCxjYWxsYmFjayxlcnJvckNhbGxiYWNrKSB7XG4gICAgICBcbiAgICAgIHNlbGYud3MgPSBuZXcgV2ViU29ja2V0KHVybC5yZXBsYWNlKFwiaHR0cFwiLFwid3NcIikgKyAnL3NpZ251bScpO1xuXG4gICAgICBzZWxmLndzLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLmNvbmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9jb25uZWN0aW9uX29wZW5lZFwiKTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH07XG4gICAgICBcbiAgICAgIHRoaXMud3Mub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk1lbnNhZ2VtIHJlY2ViaWRhOlwiICsgZS5kYXRhKVxuICAgICAgICBzZWxmLmV2ZW50cy5lbWl0KFwic2lnbnVtX29ubWVzc2FnZVwiLGUuZGF0YSk7XG4gICAgICAgIFxuICAgICAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgICAgICBcbiAgICAgICAgaWYobXNnLnJlc3BvbnNlX2lkID09ICduZXdfc2Vzc2lvbicpe1xuICAgICAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9uZXdfc2Vzc2lvblwiLG1zZyk7XG4gICAgICAgICAgICBzZWxmLnNlc3Npb25JZCA9IG1zZy5yZXNwb25zZV9vYmplY3QuaWQ7XG4gICAgICAgIH1lbHNlIGlmKG1zZy5yZXNwb25zZV9pZCA9PSAnbGlzdF9vaycpe1xuICAgICAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9saXN0X29rXCIsbXNnKTtcbiAgICAgICAgfWVsc2UgaWYobXNnLnJlc3BvbnNlX2lkID09ICdoZWxsbycpe1xuICAgICAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9oZWxsb1wiLG1zZyk7XG4gICAgICAgIH1lbHNlIGlmKG1zZy5yZXNwb25zZV9pZCA9PSAnc2lnbnVtX2xpc3RfaW5fcHJvY2Vzc2luZycpe1xuICAgICAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9saXN0X2luX3Byb2Nlc3NpbmdcIixtc2cpO1xuICAgICAgICB9ZWxzZSBpZihtc2cucmVzcG9uc2VfaWQgPT0gJ2xvZ2luX29rJyl7XG4gICAgICAgICAgICBzZWxmLmV2ZW50cy5lbWl0KFwic2lnbnVtX2xvZ2luX29rXCIsbXNnKTtcbiAgICAgICAgfWVsc2UgaWYobXNnLnJlc3BvbnNlX2lkID09ICdwaW5fcmVxdWVzdGVkJyl7XG4gICAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9waW5fcmVxdWVzdGVkXCIsbXNnKTtcbiAgICAgICAgfWVsc2UgaWYobXNnLnJlc3BvbnNlX2lkID09ICdlcnJvcicpe1xuICAgICAgICAgIHNlbGYuZXZlbnRzLmVtaXQoXCJzaWdudW1fZXJyb3JcIixtc2cpO1xuICAgICAgICAgIGVycm9yQ2FsbGJhY2sobXNnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIFxuICAgICAgdGhpcy53cy5vbmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuY29uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5ldmVudHMuZW1pdChcInNpZ251bV9jb25uZWN0aW9uX2Nsb3NlZFwiKTtcbiAgICAgIH07ICAgIFxuICAgIFxuICAgIH07XG4gICAgXG4gICAgXG4gICAgdGhpcy5uZXdfc2Vzc2lvbiA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgIHNlbGYud3Muc2VuZCgne1wibWVzc2FnZV9pZFwiOlwibmV3X3Nlc3Npb25cIixcInNlc3Npb25faWRcIjpcIicrIHNlbGYuc2Vzc2lvbklkICsnXCJ9Jyk7XG4gICAgICBzZWxmLmV2ZW50cy5vbihcInNpZ251bV9uZXdfc2Vzc2lvblwiLGNhbGxiYWNrKTtcbiAgICAgIFxuICAgIH07XG4gICAgdGhpcy51c2Vfc2Vzc2lvbiA9IGZ1bmN0aW9uKHNlc3Npb25faWQpe307XG5cbiAgICB0aGlzLmxpc3QgPSBmdW5jdGlvbihwaW5DYWxsYmFjayxsaXN0Q2FsbGJhY2spe1xuICAgICAgc2VsZi53cy5zZW5kKCd7XCJtZXNzYWdlX2lkXCI6XCJsaXN0XCIsXCJzZXNzaW9uX2lkXCI6XCInKyBzZWxmLnNlc3Npb25JZCArJ1wifScpO1xuICAgICAgc2VsZi5ldmVudHMub24oXCJzaWdudW1fcGluX3JlcXVlc3RlZFwiLHBpbkNhbGxiYWNrKTtcbiAgICAgIHNlbGYuZXZlbnRzLm9uKFwic2lnbnVtX2xpc3Rfb2tcIixsaXN0Q2FsbGJhY2spO1xuICAgIH07XG5cbiAgICB0aGlzLmxvYWRfYTEgPSBmdW5jdGlvbihjb250ZW50LHBpbixjYWxsYmFjayl7XG4gICAgICBzZWxmLndzLnNlbmQoJ3tcIm1lc3NhZ2VfaWRcIjpcImxvYWRfYTFcIixcInNlc3Npb25faWRcIjpcIicrIHNlbGYuc2Vzc2lvbklkICsnXCIsXCJjb250ZW50XCI6XCInICsgY29udGVudCArICdcIixcInBpblwiOlwiJysgcGluICsnXCJ9Jyk7XG4gICAgICBzZWxmLmV2ZW50cy5vbihcInNpZ251bV9saXN0X29rXCIsY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgdGhpcy5oZWxsbyA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgIHNlbGYud3Muc2VuZCgne1wibWVzc2FnZV9pZFwiOlwiaGVsbG9cIixcInNlc3Npb25faWRcIjpcIicrIHNlbGYuc2Vzc2lvbklkICsnXCJ9Jyk7XG4gICAgICBzZWxmLmV2ZW50cy5vbihcInNpZ251bV9oZWxsb1wiLGNhbGxiYWNrKTtcbiAgICB9OyAgICBcbiAgICBcbiAgICB0aGlzLnNldFBpbiA9IGZ1bmN0aW9uKHBpbil7XG4gICAgICBzZWxmLndzLnNlbmQoJ3tcIm1lc3NhZ2VfaWRcIjpcInBpblwiLFwic2Vzc2lvbl9pZFwiOlwiJysgc2VsZi5zZXNzaW9uSWQgKydcIixcInBpblwiOlwiJyArIHBpbiArICdcIn0nKTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbihhbGlhcyx0b2tlbixjYWxsYmFjayl7XG4gICAgICBzZWxmLmV2ZW50cy5vbihcInNpZ251bV9sb2dpbl9va1wiLGNhbGxiYWNrKTtcbiAgICAgIHNlbGYud3Muc2VuZCgne1wibWVzc2FnZV9pZFwiOlwibG9naW5cIixcInNlc3Npb25faWRcIjpcIicrIHNlbGYuc2Vzc2lvbklkICsnXCIsXCJhbGlhc1wiOlwiJyArIGFsaWFzICsgJ1wiLFwidG9rZW5cIjpcIicrIHRva2VuICsnXCJ9Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5zaWduID0gZnVuY3Rpb24oYWxpYXMsY29udGVudCxjb250ZW50TmFtZSxjb250ZW50SWQsY2FsbGJhY2spe1xuICAgICAgc2VsZi5ldmVudHMub24oXCJzaWduX29rXCIsY2FsbGJhY2spO1xuICAgICAgc2VsZi53cy5zZW5kKCd7XCJtZXNzYWdlX2lkXCI6XCJzaWduXCIsXCJzZXNzaW9uX2lkXCI6XCInKyBzZWxmLnNlc3Npb25JZCArJ1wiLFwiYWxpYXNcIjpcIicgKyBhbGlhcyArICdcIixcImNvbnRlbnRcIjpcIicrIGNvbnRlbnQgKydcIixcImNvbnRlbnRfbmFtZVwiOlwiJysgY29udGVudE5hbWUgKydcIixcImNvbnRlbnRfaWRcIjpcIicrIGNvbnRlbnRJZCArJ1wifScpO1xuICAgIH1cblxuXG59XG5cblxuXG5cbiJdfQ==
