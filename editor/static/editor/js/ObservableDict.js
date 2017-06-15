function ObservableDict(origin){
	this.dict = {};
	this.itemAddedEvent = new Event(origin);
	this.itemRemovedEvent = new Event(origin);
}

ObservableDict.prototype = {
	put: function(key, value){
		this.dict[key] = value;
		this.itemAddedEvent.notify(key);
	},

	get: function(key){
		return this.dict[key];
	},

	remove: function(key){
		delete this.dict[key];
		this.itemRemovedEvent.notify(key);
	},

	keys: function(){
		return Object.keys(this.dict);
	}
}