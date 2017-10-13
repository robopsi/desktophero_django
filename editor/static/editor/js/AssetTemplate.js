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
		this.category_safe = category.replaceAll(' ', '_');
		this.dateCreated = dateCreated
		this.thumbnailUrl = thumbnailUrl
		this.meshUrl = meshUrl;
		this.meshHiResUrl = meshHiResUrl;
		this.meshLowResUrl = meshLowResUrl;
	}

	createInstance(callback, boneGroupIdForCallback, overrideCategory){
		var self = this;

		var url;
		if (assetResolutionMode == 'high'){
			url = self.meshHiResUrl;
		} else if (assetResolutionMode == 'medium'){
			url = self.meshUrl;
		} else {
			url = self.meshLowResUrl;
		}

		LocalDataSource.jsonLoader.load(url, function(geometry, _){
			var mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial([materials.default]));
			mesh.meshName = name;
			mesh.libraryName = self.name;

			mesh.frustumCulled = false;
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();
			mesh.castShadow = true;
			mesh.receiveShadow = true;

			var asset = new Asset(self, mesh);
			if (overrideCategory){
				// needs a new uid, because there are problems if we have multiple of the same
				// asset id attached to one bone group.
				asset.uid = Uuid.uuid4();

	            asset.overrideCategory = overrideCategory;
	            asset.overrideCategory_safe = overrideCategory.replaceAll(' ', '_');
			}
			callback(asset, boneGroupIdForCallback);
		});
	}
}