function PickingView(){
	this.scene = new THREE.Scene();
	this.colorIdMap = {};

	this.scene.add(new THREE.AmbientLight(0x555555));

	this.pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
	this.pickingTexture.texture.minFilter = THREE.LinearFilter;

	this.assetUidMap = {};

	this.addModelListeners();

	window.addEventListener('resize', function(){
		self.onWindowResize();
	}, false);

	this.onWindowResize();
}

PickingView.prototype = {
	onWindowResize: function() {
		var editor_panel = document.getElementById('editor_panel');
		this.pickingTexture = new THREE.WebGLRenderTarget( editor_panel.offsetWidth, editor_panel.offsetHeight );
		this.pickingTexture.texture.minFilter = THREE.LinearFilter;
	},

	getUnusedColor: function(){
		var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		while (this.colorIdMap.keys().contains(randomColor)){
			var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		}

		return randomColor;
	}, 

	addModelListeners: function(){
		boneGroups.itemAddedEvent.addListener(this, this.onBoneGroupAdded);
	},

	onBoneGroupAdded: function(character, boneGroupUid){
		var boneGroup = boneGroups.get(boneGroupUid);
		boneGroup.assets.itemAddedEvent.addListener(this, this.onAssetAdded);
		boneGroup.assets.itemRemovedEvent.addListener(this, this.onMeshRemoved);
	},

	onAssetAdded: function(boneGroup, assetId){
		var asset = boneGroup.assets.get(assetId);

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
		while (id == undefined || id in this.assetUidMap){
			color = new THREE.Color(Math.random() * 0xffffff);
			// Create id from RGB color values
			var r = (color.r * 255);
			var g = (color.g * 255);
			var b = (color.b * 255);
			var id = ( r << 16 ) | ( g << 8 ) | ( b );
		}


		var pickingMesh = asset.mesh.clone(); //new THREE.SkinnedMesh(pickingGeometry, pickingMaterial);
		pickingMesh.uid = assetId;
		pickingMesh.material = pickingMesh.material.clone();
		pickingMesh.material.materials = [PickingView.pickingMaterial];
		
		applyVertexColors( pickingMesh.geometry, color);
		boneGroup.attachPickingMesh(pickingMesh);

		this.assetUidMap[id] = assetId;
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

		// Remove mesh from assetUidMap
		delete this.assetUidMap[meshId];
	}

	// TODO: finish adding model listeners. Meshes need to be removed from
	// the picking view when they are removed from the regular view. New
	// assets coming in need to be given a color rather than using default
	// material.
}

// Class properties/functions

PickingView.pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
PickingView.pickingMaterial.skinning = true;
