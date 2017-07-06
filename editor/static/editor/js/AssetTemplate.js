/*
Represents a particular asset that can be loaded, but uninitialized, no 
files read or mesh data loaded yet. Call the createInstance() method to get
a new Asset instance.
*/

class AssetTemplate {
	constructor(uuid, name, description, author, category, dateCreated, 
				thumbnailUrl, meshUrl, meshHiResUrl, meshLowResUrl){
		this.uuid = uuid
		this.name = name
		this.description = description
		this.author = author
		this.category = category
		this.dateCreated = dateCreated
		this.thumbnailUrl = thumbnailUrl
		this.meshUrl = meshUrl;
		this.meshHiResUrl = meshHiResUrl;
		this.meshLowResUrl = meshLowResUrl;
	}

	createInstance(callback){
		var self = this;

		LocalDataSource.jsonLoader.load(self.meshLowResUrl, function(geometry, _){
			var mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial([materials.default]));
			mesh.meshName = name;
			mesh.libraryName = self.name;

			mesh.frustumCulled = false;
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();
			mesh.castShadow = true;
			mesh.receiveShadow = true;

			var asset = new Asset(self, mesh);
			callback(asset);
		});
	}
}