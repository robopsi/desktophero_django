function Character(){
	this.name = "New Character";
	this.boneGroups = new ObservableDict(this);

	this.nameChangedEvent = new Event(this);
	this.poseChangedEvent = new Event(this);
}

Character.prototype = {
	addBoneGroup: function(boneGroup){
		this.boneGroups.put(boneGroup.uid, boneGroup);
	},

	removeBoneGroup: function(uid){
		// Remove meshes attached to bone group
		var boneGroupToRemove = this.boneGroups.get(uid);
		for (var meshName in boneGroupToRemove.meshes.dict){
			boneGroupToRemove.removeMesh(meshName);
		}

		for (var boneGroupUid in this.boneGroups.dict){
			var boneGroup = this.boneGroups.get(boneGroupUid);
			if (boneGroup.parentBoneGroupUid === uid){ //Remove child bone groups.
				this.removeBoneGroup(boneGroupUid);
			}
		}
		this.boneGroups.remove(uid);
	},

	getCurrentPose: function(){
		return Pose.toPose(this.boneGroups);
	},

	loadBoneScales: function(pose){
		for (var i = 0; i < pose.poseBones.length; i++){
			var poseBone = pose.poseBones[i];

			for (var boneGroupUid in this.boneGroups.dict){
				var boneGroup = this.boneGroups.get(boneGroupUid);

				for (var j = 0; j < boneGroup.skeleton.bones.length; j++){
					var bone = boneGroup.skeleton.bones[j];
					if (pose.affectedBones != undefined && pose.affectedBones.indexOf(bone.name) == -1){
						continue;
					}

					if (bone.name === poseBone.name){
						bone.scale.x = poseBone.scale.x;
						bone.scale.y = poseBone.scale.y;
						bone.scale.z = poseBone.scale.z;
					}
				}
			}
		}
	},

	loadPose: function(pose){
		for (var i = 0; i < pose.poseBones.length; i++){
			var poseBone = pose.poseBones[i];

			for (var boneGroupUid in this.boneGroups.dict){
				var boneGroup = this.boneGroups.get(boneGroupUid);

				for (var j = 0; j < boneGroup.skeleton.bones.length; j++){
					var bone = boneGroup.skeleton.bones[j];
					if (pose.affectedBones != undefined && pose.affectedBones.indexOf(bone.name) == -1){
						continue;
					}

					if (bone.name === poseBone.name){
						bone.position.x = poseBone.position.x;
						bone.position.y = poseBone.position.y;
						bone.position.z = poseBone.position.z;

						bone.rotation.x = poseBone.rotation.x;
						bone.rotation.y = poseBone.rotation.y;
						bone.rotation.z = poseBone.rotation.z;
					}
				}
			}
		}
	},

	loadJSONPose: function(jsonString){
		var pose = Pose.fromJson(jsonString);
		this.loadPose(pose);
	},

	loadVariation: function(variation){
		for (var i = 0; i < variation.poseBones.length; i++){
			var poseBone = variation.poseBones[i];

			for (var boneGroupUid in this.boneGroups.dict){
				var boneGroup = this.boneGroups.get(boneGroupUid);

				for (var j = 0; j < boneGroup.skeleton.bones.length; j++){
					var bone = boneGroup.skeleton.bones[j];
					if (variation.affectedBones != undefined && variation.affectedBones.indexOf(bone.name) == -1){
						continue;
					}

					if (bone.name === poseBone.name){
						bone.scale.x = poseBone.scale.x;
						bone.scale.y = poseBone.scale.y;
						bone.scale.z = poseBone.scale.z;
					}
				}
			}
		}
	},

	getName: function(){
		return this.name;
	},

	setName: function(name){
		this.name = name;
		this.nameChangedEvent.notify(this.name);
	}, 

	toJSON: function(){
		return {
			name: this.name,
			boneGroups: this.boneGroups.dict
		};
	},

	getMesh: function(meshId){
		for (var boneGroupUid in this.boneGroups.dict){
			var boneGroup = this.boneGroups.get(boneGroupUid);
			if (meshId in boneGroup.meshes.dict){
				return [boneGroupUid, boneGroup.meshes.get(meshId)];
			}
		}
		return null;
	}, 

	clear: function(){
		for (var boneGroupUid in this.boneGroups.dict){
			this.removeBoneGroup(boneGroupUid);
		}
	}
}