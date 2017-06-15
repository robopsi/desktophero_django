THREE.SkinnedMesh.prototype.toJSON = function(){
	return {
		libraryName: this.libraryName,
		name: this.name
	};
};

THREE.Bone.prototype.rotateOnWorldAxis = function(axis, radians) {
    var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(this.matrix);
    this.matrix = rotWorldMatrix;
    this.rotation.setFromRotationMatrix(this.matrix);

	/*var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3();
	this.selectedBone.matrixWorld.decompose(position, quaternion, scale);
	this.boneAxisHelper.position.set(position.x, position.y, position.z);
	this.boneAxisHelper.rotation.setFromQuaternion(quaternion);*/
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

NEXT_UID = 600;
createUid = function(prefix){
	prefix = prefix || ''
    uid = NEXT_UID;
    NEXT_UID += 1;
    return (prefix + uid + '').replaceAll(' ', '_');
};
