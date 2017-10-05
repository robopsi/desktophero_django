function PosePickingView(){
  this.colorIdMap = {};
  
  this.scene = new THREE.Scene();
  this.scene.add(new THREE.AmbientLight(0x555555));
  this.selectorScene = new THREE.Scene();

  this.pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
  this.pickingTexture.texture.minFilter = THREE.LinearFilter;

  this.addModelListeners();

  window.addEventListener('resize', function(){
    self.onWindowResize();
  }, false);

  this.onWindowResize();

  this.bones = {};
  this.pickingMeshes = {};
  this.selectorMeshes = {};
  this.boneMap = {};

  this.initLights();
}

PosePickingView.prototype = {
  createSphereMesh(color, boneGroupUid){ //sphere that is meat to be colored corresponding to bone id, for picking
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
    var mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.boneGroupUid = boneGroupUid;
    return mesh;
  },

  createSelectorSphereMesh(boneGroupUid){ //sphere that is meant to be seen by the user as a bone handle
    var sphereGeometry = new THREE.SphereGeometry(.1,10,10);
    var sphereMaterial = PosePickingView.selectorMaterial.clone();
    var mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.boneGroupUid = boneGroupUid;
    return mesh;
  },

  onBoneGroupAdded: function(character, boneGroupUid){
    var boneGroup = boneGroups.get(boneGroupUid);
    var tailBones = [];
    var pickingMeshEntries = {};
    var selectorMeshEntries = {};

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

      var pickingMeshes = [];
      var selectorMeshes = [];
      for (var j = 0; j < 10; j++){
        var sphereMesh = this.createSphereMesh(color, bone.boneGroupUid);
        pickingMeshes.push(sphereMesh);
        this.scene.add(sphereMesh);
        var selectorSphereMesh = this.createSelectorSphereMesh(bone.boneGroupUid);
        selectorMeshes.push(selectorSphereMesh);
        this.selectorScene.add(selectorSphereMesh);
      }
      pickingMeshEntries[bone.parent.name] = pickingMeshes;
      selectorMeshEntries[bone.parent.name] = selectorMeshes;
    }
    this.bones[boneGroup.uid] = tailBones;
    this.pickingMeshes[boneGroup.uid] = pickingMeshEntries;
    this.selectorMeshes[boneGroup.uid] = selectorMeshEntries;

    // update when bones are reattached. TODO: or moved, rotated, etc.
    boneGroup.attachedEvent.addListener(this, this.onBoneGroupNeedsUpdate);
    boneGroup.unattachedEvent.addListener(this, this.onBoneGroupNeedsUpdate);

    this.update();
  },

  onBoneGroupRemoved: function(character, boneGroupUid){
    // Remove sphere selectors.
    var boneGroupsToRemove = [];
    for (var i in this.scene.children){
      var sceneElement = this.scene.children[i];
      if (sceneElement.boneGroupUid === boneGroupUid){
        boneGroupsToRemove.push(sceneElement);
      }
    }
    for (var i in boneGroupsToRemove){
      var element = boneGroupsToRemove[i];
      this.scene.remove(element);
    }

    var boneGroupsToRemove = [];
    for (var i in this.selectorScene.children){
      var sceneElement = this.selectorScene.children[i];
      if (sceneElement.boneGroupUid === boneGroupUid){
        boneGroupsToRemove.push(sceneElement);
      }
    }
    for (var i in boneGroupsToRemove){
      var element = boneGroupsToRemove[i];
      this.selectorScene.remove(element);
    }
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
      var pickingMeshEntries = this.pickingMeshes[boneGroupUid];
      var selectorMeshEntries = this.selectorMeshes[boneGroupUid];
      for (var i = 0; i < bones.length; i++){
        var bone = bones[i];
        rbone = bone;
        var pickingMeshes = pickingMeshEntries[bone.parent.name];
        var selectorMeshes = selectorMeshEntries[bone.parent.name];
        tail.setFromMatrixPosition(bone.matrixWorld);
        head.setFromMatrixPosition(bone.parent.matrixWorld);

        for (var j = 0; j < 10; j++){
          var temp3 = tail.clone();
          temp3.lerp(head, j/10.0);

          var sphereMesh = pickingMeshes[j];
          sphereMesh.position.x = temp3.x;
          sphereMesh.position.y = temp3.y;
          sphereMesh.position.z = temp3.z;

          var selectorSphereMesh = selectorMeshes[j];
          selectorSphereMesh.position.x = temp3.x;
          selectorSphereMesh.position.y = temp3.y;
          selectorSphereMesh.position.z = temp3.z;
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
    boneGroups.itemRemovedEvent.addListener(this, this.onBoneGroupRemoved);
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

  initLights: function(){
    this.ambientLight = new THREE.AmbientLight(0x555555);
    this.selectorScene.add(this.ambientLight);

    var pointLight = new THREE.SpotLight(0xffffff);
    pointLight.position.y = 10;
    pointLight.position.z = 20;
    pointLight.position.x = -5;
    pointLight.castShadow = true;
    pointLight.intensity = 0.75;
    this.selectorScene.add(pointLight);

    var pointLight2 = new THREE.SpotLight(0xffffdd);
    pointLight2.position.y = 60;
    pointLight2.position.z = -40;
    pointLight2.position.x = 20;
    pointLight2.castShadow = true;
    this.selectorScene.add(pointLight2);

    var pointLight3 = new THREE.SpotLight(0xffffdd);
    pointLight3.position.y = 10;
    pointLight3.position.z = 40;
    pointLight3.position.x = -20;
    pointLight3.castShadow = true;
    pointLight.intensity = 0.15;
    this.selectorScene.add(pointLight3);
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
  },

  markBoneSelected: function(bone, selected){
    if (!bone){
      return;
    }

    var meshes = this.selectorMeshes[bone.boneGroupUid][bone.name];
    var color = PosePickingView.unselectedColor;
    if (selected){
      color = PosePickingView.selectedColor;
    }
    for (var i = 0; i < meshes.length; i++){
      var mesh = meshes[i];
      mesh.material.color.set(color);
    }
    view.requestRender();
  }

  // TODO: finish adding model listeners. Meshes need to be removed from
  // the picking view when they are removed from the regular view. New
  // assets coming in need to be given a color rather than using default
  // material.
}

// Class properties/functions

PosePickingView.unselectedColor = new THREE.Color(.35, .35, .35);
PosePickingView.selectedColor = new THREE.Color(1, .8, .0);
PosePickingView.pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
PosePickingView.selectorMaterial = new THREE.MeshPhongMaterial({
                                        color: PosePickingView.unselectedColor,
                                        shading: THREE.SmoothShading,
                                        shading: false
                                      });