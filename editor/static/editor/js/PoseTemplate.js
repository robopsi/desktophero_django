/*
Represents a particular pose file.
*/

class PoseTemplate {
	constructor(uuid, name, description, author, category, dateCreated, 
				thumbnailUrl, fileUrl, license){
		this.uuid = uuid;
		this.name = name;
		this.description = description;
		this.author = author;
		this.category = category;
		this.dateCreated = dateCreated;
		this.thumbnailUrl = thumbnailUrl;
		this.fileUrl = fileUrl;
		this.license = license;
	}

	loadJSON(callback){
		var self = this;

		jQuery.get({
			url: self.fileUrl,
			success: function(poseContent, textStatus, jqXHR){
				callback(self, JSON.parse(poseContent));
			}
		});
	}
}