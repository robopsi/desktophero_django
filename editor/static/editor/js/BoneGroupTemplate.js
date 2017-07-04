/*
Represents a particular bone group that can be loaded, but uninitialized, no 
files read or skeleton loaded yet. Call the createInstance() method to get
a new BoneGroup instance.
*/

class BoneGroupTemplate {
	constructor(uuid, name, description, author, categories, dateCreated, 
				thumbnailUrl, fileUrl){
		this.uuid = uuid
		this.name = name
		this.description = description
		this.author = author
		this.categories = categories
		this.dateCreated = dateCreated
		this.thumbnailUrl = thumbnailUrl
		this.fileUrl = fileUrl
	}

	createInstance(callback){
		var self = this;
		LocalDataSource.jsonLoader.load(self.fileUrl, function(geometry, materials){
			// Get skeleton out of geometry.
			var mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
			var skeleton = mesh.skeleton;

			// Construct new bone group with skeleton.
			var boneGroup = new BoneGroup(self, skeleton);
			callback(boneGroup);
		});
	}
}