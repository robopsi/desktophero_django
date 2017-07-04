/*
Information about a preset, including the file url.
*/

class Preset {
	constructor(uuid, name, description, author, category, dateCreated, 
				thumbnailUrl, fileUrl){
		this.uuid = uuid
		this.name = name
		this.description = description
		this.author = author
		this.category = category
		this.dateCreated = dateCreated
		this.thumbnailUrl = thumbnailUrl
		this.fileUrl = fileUrl
	}

	getFileContents(callback){;
		jQuery.get(this.fileUrl, function(contents){
			callback(contents);
		});
	}
}