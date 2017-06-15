function ObservableList(origin){
	this.list = []
	this.itemAddedEvent = new Event(origin);
	this.itemRemovedEvent = new Event(origin);
}

ObservableList.prototype = {
	add: function(value){
		this.list.push(value);
		this.itemAddedEvent.notify(value);
	},

	get: function(index){
		return this.list[index];
	},

	remove: function(index){
		var value = this.list[i];
		delete this.list[i];
		this.itemRemovedEvent.notify(value);
	},

	length: function(){
		return this.list.length;
	},

	clear: function(){
		var copy = this.list;

		this.list = [];
		for (var i = 0; i < copy.length; i++){
			this.itemRemovedEvent.notify(list[i]);
		}
	},

	addAll: function(list){
		for (var i = 0; i < list.length; i++){
			this.add(list[i]);
		}
	}
}