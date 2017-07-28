function PosePickingView(){
  this.scene = new THREE.Scene();
  this.colorIdMap = {};

  this.scene.add(new THREE.AmbientLight(0x555555));

  this.pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
  this.pickingTexture.texture.minFilter = THREE.LinearFilter;

  this.addModelListeners();

  window.addEventListener('resize', function(){
    self.onWindowResize();
  }, false);

  this.onWindowResize();

  this.bones = {};
  this.helperMeshes = {};
  this.boneMap = {};
}

PosePickingView.prototype = {
  createSphereMesh(color){
    var sphereGeometry = new THREE.SphereGeometry(.1,10,10);
    var sphereMaterial = PosePickingView.pickingMaterial;
    
    function applyVertexColors( g, c ) {
      g.faces.forEach( function( f ) {
        var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
        for( var j = 0; j < n; j ++ ) {
          f.vertexColors[ j ] = c;
        }
      });
    }

    applyVertexColors(sphereGeometry, color);
    return new THREE.Mesh(sphereGeometry, sphereMaterial);
  }, 

  onBoneGroupAdded: function(character, boneGroupUid){
    var boneGroup = boneGroups.get(boneGroupUid);
    var tailBones = [];
    var helperMeshEntries = {};

    var bones = boneGroup.skeleton.bones;
    for (var i = 0; i < bones.length; i++) {
      var bone = bones[i];
      if (!bone.name.startsWith("@")) { // @<name> marks the tail of a bone that should be selectable in DH
        continue;
      }
      console.log(bone.name);
      tailBones.push(bone);

      // Find a unique color/id for this bone
      var color;
      var id = undefined;
      while (id == undefined || id in this.boneMap){
        color = new THREE.Color(Math.random() * 0xffffff);
        // Create id from RGB color values
        var r = (color.r * 255);
        var g = (color.g * 255);
        var b = (color.b * 255);
        var id = ( r << 16 ) | ( g << 8 ) | ( b );
      }
      this.boneMap[id] = bone.parent;

      var helperMeshes = [];
      for (var j = 0; j < 10; j++){
        var sphereMesh = this.createSphereMesh(color);
        helperMeshes.push(sphereMesh);
        view.scene.add(sphereMesh);
        this.scene.add(sphereMesh);
      }
      helperMeshEntries[bone.parent.name] = helperMeshes;
    }
    this.bones[boneGroup.uid] = tailBones;
    this.helperMeshes[boneGroup.uid] = helperMeshEntries;

    // update when bones are reattached. TODO: or moved, rotated, etc.
    boneGroup.attachedEvent.addListener(this, this.onBoneGroupNeedsUpdate);
    boneGroup.unattachedEvent.addListener(this, this.onBoneGroupNeedsUpdate);

    this.update();
  },

  onBoneGroupNeedsUpdate: function(character, boneGroupUid){
    this.update();
  },

  update: function(){
    var boneMatrix = new THREE.Matrix4();
    var tail = new THREE.Vector3();
    var head = new THREE.Vector3();

    for (var boneGroupUid in this.bones){
      var bones = this.bones[boneGroupUid];
      var helperMeshEntries = this.helperMeshes[boneGroupUid];
      for (var i = 0; i < bones.length; i++){
        var bone = bones[i];
        var helperMeshes = helperMeshEntries[bone.parent.name];
        tail.setFromMatrixPosition(bone.matrixWorld);
        head.setFromMatrixPosition(bone.parent.matrixWorld);

        for (var j = 0; j < 10; j++){
          var temp3 = tail.clone();
          temp3.lerp(head, j/10.0);

          var sphereMesh = helperMeshes[j];
          sphereMesh.position.x = temp3.x;
          sphereMesh.position.y = temp3.y;
          sphereMesh.position.z = temp3.z;
        }
      }
    }

    view.requestRender();
  },

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

  

  onAssetAdded: function(boneGroup, assetId){
    /*var asset = boneGroup.assets.get(assetId);

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
    pickingMesh.material.materials = [PosePickingView.pickingMaterial];
    
    applyVertexColors( pickingMesh.geometry, color);
    boneGroup.attachPickingMesh(pickingMesh);

    this.assetUidMap[id] = assetId;
    this.scene.add(pickingMesh);*/
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

PosePickingView.pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );