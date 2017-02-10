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
