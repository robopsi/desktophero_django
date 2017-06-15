function PickingView(model){
	this.model = model;

	this.scene = new THREE.Scene();
	this.colorIdMap = {};

	this.scene.add(new THREE.AmbientLight(0x555555));

	this.pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
	this.pickingTexture.texture.minFilter = THREE.LinearFilter;

	this.meshIdMap = {};

	this.addModelListeners();
}

PickingView.prototype = {

	getUnusedColor: function(){
		var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		while (this.colorIdMap.keys().contains(randomColor)){
			var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		}

		return randomColor;
	}, 

	addModelListeners: function(){
		this.model.character.boneGroups.itemAddedEvent.addListener(this, this.onBoneGroupAdded);
	},

	onBoneGroupAdded: function(character, boneGroupUid){
		var boneGroup = character.boneGroups.get(boneGroupUid);
		boneGroup.meshes.itemAddedEvent.addListener(this, this.onMeshAdded);
		boneGroup.meshes.itemRemovedEvent.addListener(this, this.onMeshRemoved);
	},

	onMeshAdded: function(boneGroup, meshId){
		var mesh = this.model.character.getMesh(meshId)[1];

		function applyVertexColors( g, c ) {
			g.faces.forEach( function( f ) {
				var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
				for( var j = 0; j < n; j ++ ) {
					f.vertexColors[ j ] = c;
				}
			});
		}

		// Find a unique color/id for this mesh
		var color;
		var id = undefined;
		while (id == undefined || id in this.meshIdMap){
			color = new THREE.Color(Math.random() * 0xffffff);
			// Create id from RGB color values
			var r = (color.r * 255);
			var g = (color.g * 255);
			var b = (color.b * 255);
			var id = ( r << 16 ) | ( g << 8 ) | ( b );
		}

		var pickingMesh = mesh.clone(); //new THREE.SkinnedMesh(pickingGeometry, pickingMaterial);
		pickingMesh.uid = meshId;
		pickingMesh.material = pickingMesh.material.clone();
		pickingMesh.material.materials = [PickingView.pickingMaterial];
		
		applyVertexColors( pickingMesh.geometry, color);
		boneGroup.attachPickingMesh(pickingMesh);

		this.meshIdMap[id] = mesh.uid;
		this.scene.add(pickingMesh);
	},

	onMeshRemoved: function(boneGroup, meshId){
		// Remove mesh from scene
		var toRemove = [];
		for (var i in this.scene.children){
			var sceneElement = this.scene.children[i];
			if (sceneElement.uid == meshId){
				toRemove.push(sceneElement);
			}
		}
		for (var i = toRemove.length - 1; i >= 0; i--){ // Go backwards so we don't mess up the indices when we're removing elements.
			var element = toRemove[i];
			this.scene.remove(element);
		}

		// Remove mesh from meshIdMap
		delete this.meshIdMap[meshId];
	}

	// TODO: finish adding model listeners. Meshes need to be removed from
	// the picking view when they are removed from the regular view. New
	// meshes coming in need to be given a color rather than using default
	// material.
}

// Class properties/functions

PickingView.pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
PickingView.pickingMaterial.skinning = true;
