function Pose(){
	this.name = "Pose";
	this.author = "Unknown";
	this.library = "Unknown";
	this.type = "Uncategorized";
	this.tags = [];

	this.poseBones = [];
}

function PoseBoneGroup(boneGroup){
	this.boneGroupTemplateId = boneGroup.template.uuid;
	this.name = boneGroup.template.name;
}

/*
Structure: 

top-level bone group template id
	bones: bone, bone, bone, bone
	children: 
		bone group name
			bone, bone, bone, bone
		bone group name
			bone, bone, bone, bone
		bone group name
			bone, bone, bone, bone

top-level bone template id
	bones: bone, bone, bone, bone
	children: 
		bone group name
			bone, bone, bone, bone
*/

Pose.toJson = function(pose, poseName, author, library, type, tags){
	pose.name = poseName;
	pose.author = author;
	pose.library = library;
	pose.type = type;
	pose.tags = tags;

	return JSON.stringify(pose, ' ', ' ');
}

boneGroupToJson = function(boneGroup){
	console.log(boneGroup);
	var json = {};
	json.name = boneGroup.template.name;

	json.bones = {};

	for (var i = 0; i < boneGroup.skeleton.bones.length; i++){
		var bone = boneGroup.skeleton.bones[i];
		if (bone.name.startsWith("#") || bone.name.startsWith("@")){ // Ignore attach points and 'bone end' points
			continue;
		}

		json.bones[bone.name] = {};
		var position = bone.position;
		var rotation = bone.rotation;
		var scale = bone.scale;
		console.log(scale);

		json.bones[bone.name].position = position;
		json.bones[bone.name].rotation = rotation;
		json.bones[bone.name].scale = scale;
	}

	json.ignore = false;

	json.children = [];
	for (var i = 0; i < boneGroup.childBones.length; i++){
		var childBoneJson = boneGroupToJson(boneGroup.childBones[i]);
		json.children.push(childBoneJson);
	}
	return json;
}

Pose.toPose = function(boneGroups){
	var pose = {};
	var topLevelBoneGroups = Pose.findTopLevelBoneGroups(boneGroups);
	for (var i = 0; i < topLevelBoneGroups.length; i++){
		var boneGroup = topLevelBoneGroups[i];
		pose.boneGroups = boneGroupToJson(boneGroup);
	}

	/*for (var boneGroupUid in boneGroups.dict){
		var boneGroup = boneGroups.get(boneGroupUid);
		for (var i = 0; i < boneGroup.skeleton.bones.length; i++){
			var bone = boneGroup.skeleton.bones[i];
			if (bone.name.startsWith("#") || bone.name.startsWith("@")){ // Ignore attach points and 'bone end' points
				continue;
			}

			poseBone = new PoseBone(bone.name, bone.position, bone.rotation, bone.scale);
			pose.poseBones.push(poseBone);
		}
	}*/

	return pose;
}

Pose.findTopLevelBoneGroups = function(boneGroups){
	var results = [];
	for (var boneGroupUid in boneGroups.dict){
		var boneGroup = boneGroups.get(boneGroupUid);
		if (boneGroup.parentBone == null){
			results.push(boneGroup);
		}
	}
	return results;
}

Pose.fromJson = function(jsonString){
	return JSON.parse(jsonString);
}

PoseBone = function(name, position, rotation, scale){
	this.name = name;
	this.position = new THREE.Vector3(position.x, position.y, position.z);
	this.rotation = new THREE.Vector3(rotation.x, rotation.y, rotation.z);
	this.scale = new THREE.Vector3(scale.x, scale.y, scale.z);
	this.affected = true;
}

Pose.clearPose = function(poseJson, boneGroups){
	var topLevelBoneGroups = Pose.findTopLevelBoneGroups(boneGroups);
	for (var i = 0; i < topLevelBoneGroups.length; i++){
		var topLevelBoneGroup = topLevelBoneGroups[i];
		if (topLevelBoneGroup.template.name == boneGroupJson['name']){
			Pose.loadBonePose(boneGroupJson, topLevelBoneGroup);
			break;
		}
	}
}

Pose.loadPose = function(poseJson, boneGroups){
	// Match a top level bone group to all the top level bone groups in the
	// pose JSON, and start them off recursively setting the bone pose to json.
	var topLevelBoneGroups = Pose.findTopLevelBoneGroups(boneGroups);
	for (var key in poseJson){
		var boneGroupJson = poseJson[key];
		for (var i = 0; i < topLevelBoneGroups.length; i++){
			var topLevelBoneGroup = topLevelBoneGroups[i];
			if (topLevelBoneGroup.template.name == boneGroupJson['name']){
				Pose.loadBonePose(boneGroupJson, topLevelBoneGroup);
				break;
			}
		}
	}

	// Update bone skeleton
	view.requestRender();
    setTimeout(function(){
    	posePickingView.update();
    	view.requestRender();
    }, 100); 
}

Pose.loadBonePose = function(boneGroupJson, boneGroup){
	// Apply rotation, scale, position to this bone.
	if (!boneGroupJson['ignore']){
		for (var i = 0; i < boneGroup.skeleton.bones.length; i++){
			var bone = boneGroup.skeleton.bones[i];
			if (bone.name.startsWith("#") || bone.name.startsWith("@")){ // Ignore attach points and 'bone end' points
				continue;
			}

			var copyFrom = boneGroupJson['bones'][bone.name];
			if (!copyFrom){ // No result found
				console.error('No match found for bone ' + bone.name + ' in bone group ' + boneGroup.template.name + ' while loading pose.');
				continue;
			}

			aa = bone;
			bb = bone.scale;

			var rotation = copyFrom.rotation;
			bone.rotation.fromArray([rotation._x, rotation._y, rotation._z, rotation._order]);
			var scale = copyFrom.scale;
			console.log(scale);
			bone.scale.fromArray([scale.x, scale.y, scale.z]);
			var position = copyFrom.position;
			console.log(position);
			bone.position.fromArray([position.x, position.y, position.z]);
		}
	}

	// Match up children bones to children in json pose and continue recursively
	// loading poses
	for (var i = 0; i < boneGroupJson.children.length; i++){
		var childBoneGroupJson = boneGroupJson.children[i];
		for (var j = 0; j < boneGroup.childBones.length; j++){
			var childBoneGroup = boneGroup.childBones[i];
			if (childBoneGroup && childBoneGroup.template.name == childBoneGroupJson['name']){
				Pose.loadBonePose(childBoneGroupJson, childBoneGroup);
				break;
			}
		}
	}
}