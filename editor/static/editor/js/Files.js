function readCharacterFile (evt) {
	var files = evt.target.files;
	var file = files[0];
	var reader = new FileReader();
	reader.onload = function() {
		model.character.clear();
		model.loadJSONPreset(this.result);
	}
	reader.readAsText(file);
}

function readAssetFile (evt) {
	var files = evt.target.files;
	var file = files[0];
	var filename = file['name'];
	var match = filename.match(/\.[^/.]+$/);
	var name = filename.substring(0, match.index);
	var extension = filename.substring(match.index);
	var reader = new FileReader();

	reader.onload = function() {
		var contents = this.result;

		var geometry;
		if (extension == '.json' || extension == '.js'){
			var json = JSON.parse(contents);
			var results = new THREE.JSONLoader().parse(json);
			geometry = results['geometry'];
		} else if (extension == '.stl'){
			geometry = new THREE.STLLoader().parse(contents);
			geometry = new THREE.Geometry().fromBufferGeometry(geometry);
			geometry.rotateX(-Math.PI/2);
		} else {
			sweetAlert({
				title: '',
				html: 'Filetype $(extension) is not supported. Supported filetypes are: .js, .json, .stl'
			});
			return;
		}

		model.libraries.get('default').addMesh(name, '', 'custom', [], geometry);
		sweetAlert({
			title: '',
			html: 'Mesh "' + name + '" has been successfully loaded. <br> Look for it in the mesh library under "custom".'
		});
		var uid = view.selectedMesh.boneGroupUid;
		view.libraryClearMeshes();
		view.libraryPopulateMeshes(uid);
		view.showLibrary('mesh');
	};

	if (extension == '.json' || extension == '.js'){
		reader.readAsText(file);
	} else if (extension == '.stl'){
		reader.readAsBinaryString(file);
	}
}

function readPoseFile (evt) {
	var files = evt.target.files;
	var file = files[0];
	var reader = new FileReader();
	reader.onload = function() {
		model.character.loadJSONPose(this.result);
	}
	reader.readAsText(file);
}