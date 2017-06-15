function SceneModel(){
	this.userSettings = new UserSettings();

	this.libraries = new ObservableDict();
	this.libraries.put("default", new LocalDataSource("default", "/defaultlib"));

	this.character = new Character();

	this.materials = {};

	this.defaultCharacter = "human male";
}

SceneModel.prototype = {
	getAvailableMeshes: function(){
		var allMeshes = [];
		for (var libraryName in this.libraries.dict){
			var library = this.libraries.get(libraryName);
			var meshes = library.getMeshes();
			for (var meshName in meshes){
				meshMetadata = meshes[meshName];
				allMeshes.push(meshMetadata);
			}
		}
		return allMeshes;
	},

	getMeshesForType: function(types){
		var allMeshes = [];
		for (var libraryName in this.libraries.dict){
			var library = this.libraries.get(libraryName);
			// Custom meshes
			meshes = library.getCustomMeshes();
			for (var meshName in meshes){
				var meshMetadata = meshes[meshName]['metadata'];
				if (types.indexOf(meshMetadata.type) > -1){
					allMeshes.push(meshMetadata);
				}
			}
			// Regular Meshes
			var meshes = library.getMeshes();
			for (var meshName in meshes){
				var meshMetadata = meshes[meshName];
				if (types.indexOf(meshMetadata.type) > -1){
					allMeshes.push(meshMetadata);
				}
			}
		}
		return allMeshes;
	},

	addMesh(boneGroupUid, libraryName, meshName){
		var defaultMaterial = self.materials["default"];
		var boneGroup = this.character.boneGroups.get(boneGroupUid);
		this.libraries.get(libraryName).fetchMesh(meshName, function(name, mesh){
			mesh.material = new THREE.MeshFaceMaterial([defaultMaterial]);
			boneGroup.addMesh(meshName, mesh);
		});
	},

	removeMesh(meshId){
		var boneGroups = this.character.boneGroups;
		for (var boneGroupUid in boneGroups.dict){
			var boneGroup = this.character.boneGroups.get(boneGroupUid);
			if (meshId in boneGroup.meshes.dict){
				boneGroup.removeMesh(meshId);
			}
		}
	},

	getAvailablePoses: function(){
		var allPoses = {};
		for (var libraryName in this.libraries.dict){
			allPoses[libraryName] = [];

			var library = this.libraries.get(libraryName);
			var poses = library.getPoses();
			for (var poseName in poses.dict){
				var pose = poses.get(poseName);
				allPoses[libraryName].push(pose);
			}
		}
		return allPoses;
	},

	getAvailableBoneGroups: function(){
		var allBoneGroups = {};
		for (var libraryName in this.libraries.dict){
			allBoneGroups[libraryName] = [];

			var library = this.libraries.get(libraryName);
			var boneGroups = library.getBoneGroups();
			for (boneGroupUid in boneGroups.dict){
				var boneGroup = boneGroups.get(boneGroupUid);
				allBoneGroups[libraryName].push(boneGroup);
			}
		}
		return allBoneGroups;
	},

	addBoneGroup: function(libraryName, boneGroupName){
		// TODO: Change the name of the bone group if a bone group with
		// that name already exists on the character.
		self = this;
		self.libraries.get(libraryName).fetchBoneGroup(boneGroupName, function(boneGroup){
			self.character.addBoneGroup(boneGroup);
		});
	},

	removeBoneGroup: function(boneGroupUid){
		self.character.removeBoneGroup(boneGroupUid);
	},

	getAvailableAttachPoints: function(){
		var allAttachPoints = {};
		var boneGroups = this.character.boneGroups;
		for (var boneGroupUid in boneGroups.dict){
			allAttachPoints[boneGroupUid] = [];
			var boneGroup = boneGroups.get(boneGroupUid);
			for (var attachPointName in boneGroup.attachPoints){
				allAttachPoints[boneGroupUid].push(attachPointName);
			}
		}
		return allAttachPoints;
	},

	attachBoneGroup: function(boneGroupUid, toBoneGroupUid, attachPointName){
		var boneGroup = this.character.boneGroups.get(boneGroupUid);
		var attachBone = this.character.boneGroups.get(toBoneGroupUid).attachPoints[attachPointName];
		boneGroup.attachToBone(toBoneGroupUid, attachPointName, attachBone);
	},

	unattachBoneGroup: function(boneGroupUid){
		var boneGroup = this.character.boneGroups.get(boneGroupUid);
		boneGroup.unattach();
	},

	saveCurrentPose: function(poseName, library, author, type, tags){
		currentPose = this.character.getCurrentPose();
		jsonString = Pose.toJson(currentPose, poseName, library, author, type, tags);
		FileSaver.download(jsonString, poseName + ".txt");
	},

	loadJSONPose: function(libraryName, poseName){
		var self = this;
		self.libraries.get(libraryName).fetchPose(poseName, function(poseJson){
			self.character.loadJSONPose(poseJson);
		});
	},

	getCharacterJson: function(){
		// Must save bone groups, meshes attached to bone groups, 
		// places meshes are attached, pos/rot/scale of bone groups, pose.

		/*var json = {
			character: this.character.toJSON(),
			pose: this.character.getCurrentPose()
		};*/
		var character = {};
		character.boneGroups = [];
		character.meshes = {};
		character.attachments = {};
		var boneGroups = this.character.boneGroups;
		for (var boneGroupUid in boneGroups.dict){
			var boneGroup = boneGroups.get(boneGroupUid);
			character.boneGroups.push(boneGroup.name);

			for (var meshId in boneGroup.meshes.dict){
				var mesh = boneGroup.meshes.get(meshId);
				character.meshes[mesh.name] = boneGroup.name;
			}

			console.log(boneGroup.parentBone);
			if (boneGroup.parentBone != null){
				var parentBoneGroup = this.character.boneGroups.get(boneGroup.parentBoneGroupUid);
				character.attachments[boneGroup.name] = [parentBoneGroup.name, boneGroup.parentBoneName];
			}
		}

		character.pose = this.character.getCurrentPose();

		return JSON.stringify(character, null, "\t");
	},

	saveCharacter: function(){
		var characterJson = this.getCharacterJson();
		FileSaver.download(characterJson, this.character.name + ".txt");
	},

	setResolution: function(resolution){
		var defaultLib = this.libraries.get('default');
		if (resolution == defaultLib.resolution){
			return;
		}

		if (resolution == 'high' || resolution == 'low' || resolution == 'medium'){
			defaultLib.resolution = resolution;
			var characterJson = this.getCharacterJson();
			this.character.clear();
			this.loadJSONPreset(characterJson);
		} else {
			console.log("Invalid resolution: " + resolution);
		}
	},

	initCharacter: function(){
		this.loadPreset('default', this.defaultCharacter);
	},

	presetBoneGroupsAdded: function(preset, boneGroupUids){
		var self = this;

		var defaultDataSource = self.libraries.get('default');
		var meshesLeftToBeLoaded = Object.keys(preset.meshes).length;

		var defaultMaterial = self.materials["default"];
		// Attach meshes to bone groups.
		for (var i = 0; i < Object.keys(preset.meshes).length; i++){
			var name = Object.keys(preset.meshes)[i];

			defaultDataSource.fetchMesh(name, function(name, mesh){
				// Get the UID of the bone group matching this mesh.
				var boneGroupName = preset.meshes[name];
				var boneGroupUid = boneGroupUids[boneGroupName];
				var boneGroup = self.character.boneGroups.get(boneGroupUid);
				mesh.material = new THREE.MeshFaceMaterial([defaultMaterial]);

				boneGroup.addMesh(name, mesh);
				meshesLeftToBeLoaded -= 1;
				if (meshesLeftToBeLoaded <= 0){
					self.presetMeshesAdded(preset, boneGroupUids);
				}
			});
		}
	},

	presetMeshesAdded: function(preset, boneGroupUids){
		// Attach bone groups to their correct parent bones.
		self = this;

		for (var i = 0; i < Object.keys(preset.attachments).length; i++){
			var boneGroupName = Object.keys(preset.attachments)[i];
			var boneGroupUid = boneGroupUids[boneGroupName];
			var boneGroup = self.character.boneGroups.get(boneGroupUid);

			var attachToName = preset.attachments[boneGroupName][0];
			var attachToUid = boneGroupUids[attachToName];
			var attachToBoneGroup = self.character.boneGroups.get(attachToUid);
			var attachToPoint = preset.attachments[boneGroupName][1];

			boneGroup.attachToBone(attachToUid, attachToPoint, attachToBoneGroup.attachPoints[attachToPoint]);
		}

		// Load pose.
		if (preset.pose != undefined){
			self.character.loadPose(preset.pose);
		}
	},

	loadVariation: function(libraryName, variationName){
		var self = this;

		dataSource = this.libraries.get(libraryName);
		dataSource.fetchVariation(variationName, function(json){
			self.loadJSONVariation(json);
		});
	},

	loadPreset: function(libraryName, presetName){
		var self = this;

		dataSource = this.libraries.get(libraryName);
		dataSource.fetchPreset(presetName, function(json){
			self.loadJSONPreset(json);
		});
	}, 

	loadJSONPreset: function(json){
		var self = this;
		preset = JSON.parse(json);

			var defaultDataSource = self.libraries.get('default');
			var boneGroupsLeftToBeLoaded = preset.boneGroups.length;
			var boneGroupUids = {};

			for (var i = 0; i < preset.boneGroups.length; i++){
				var name = preset.boneGroups[i];

				defaultDataSource.fetchBoneGroup(name, function(boneGroup){
					self.character.addBoneGroup(boneGroup);
					boneGroupUids[boneGroup.name] = boneGroup.uid;
					boneGroupsLeftToBeLoaded -= 1;
					if (boneGroupsLeftToBeLoaded <= 0){
						self.presetBoneGroupsAdded(preset, boneGroupUids);
					}
				});
			}
	},

	loadJSONVariation: function(json){
		var variation = JSON.parse(json);
		this.character.loadVariation(variation);
	}
};