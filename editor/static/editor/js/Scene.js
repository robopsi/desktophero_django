
$(document).ready( function(){
	// document.getElementById('loadCharacter').addEventListener('change', readCharacterFile, false);

	// document.getElementById('loadPose').addEventListener('change', readPoseFile, false);

	// document.getElementById('loadAsset').addEventListener('change', readAssetFile, false);

	//window.model.initCharacter();

	//$("#editor").append(window.view.renderer.domElement);
	view.onWindowResize();
});

function addBoneGroup(boneGroup){
	boneGroups.put(boneGroup.uid, boneGroup);
}

function removeBoneGroup(uid){
	// Remove meshes attached to bone group
	var boneGroupToRemove = boneGroups.get(uid);
	for (var meshName in boneGroupToRemove.meshes.dict){
		boneGroupToRemove.removeMesh(meshName);
	}

	for (var boneGroupUid in boneGroups.dict){
		var boneGroup = boneGroups.get(boneGroupUid);
		if (boneGroup.parentBoneGroupUid === uid){ //Remove child bone groups.
			this.removeBoneGroup(boneGroupUid);
		}
	}
	boneGroups.remove(uid);
}

function getCurrentPose(){
	return Pose.toPose(boneGroups);
}

function loadBoneScales(pose){
	for (var i = 0; i < pose.poseBones.length; i++){
		var poseBone = pose.poseBones[i];

		for (var boneGroupUid in boneGroups.dict){
			var boneGroup = boneGroups.get(boneGroupUid);

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
}

function loadPose(pose){
	for (var i = 0; i < pose.poseBones.length; i++){
		var poseBone = pose.poseBones[i];

		for (var boneGroupUid in boneGroups.dict){
			var boneGroup = boneGroups.get(boneGroupUid);

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
}

function loadJSONPose(jsonString){
	var pose = Pose.fromJson(jsonString);
	this.loadPose(pose);
}

function loadVariation(variation){
	for (var i = 0; i < variation.poseBones.length; i++){
		var poseBone = variation.poseBones[i];

		for (var boneGroupUid in boneGroups.dict){
			var boneGroup = boneGroups.get(boneGroupUid);

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
}

function getName(){
	return this.name;
}

function setName(name){
	this.name = name;
	this.nameChangedEvent.notify(this.name);
}

function toJSON(){
	return {
		name: this.name,
		boneGroups: boneGroups.dict
	};
}

function getMesh(meshId){
	for (var boneGroupUid in boneGroups.dict){
		var boneGroup = boneGroups.get(boneGroupUid);
		if (meshId in boneGroup.meshes.dict){
			return [boneGroupUid, boneGroup.meshes.get(meshId)];
		}
	}
	return null;
}

function clear(){
	for (var boneGroupUid in boneGroups.dict){
		this.removeBoneGroup(boneGroupUid);
	}
}

function exportToSTL(){
	var stlString = new THREE.STLExporter().parse(this.scene);
	var blob = new Blob([stlString], {type: 'text/plain'});
	
	FileSaver.download(blob, getName() + '.stl');
}

boneGroups = new ObservableDict(this);

materials = new Materials();
view = new SceneView();
view.animate();
