function Event(sender){
	this.sender = sender;
	this.listeners = [];
}

Event.prototype = {
	addListener: function (source, listener){
		this.listeners.push(listener.bind(source));
	},
	notify: function (args){
		for (var i = 0; i < this.listeners.length; i += 1){
			this.listeners[i](this.sender, args);
		}
	}
};