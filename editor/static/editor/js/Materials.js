function Materials(){

}

Materials.createReflectiveMaterial = function(color, reflectivity, cubeMap){
	var material = new THREE.MeshPhongMaterial({
		color: color,
		reflectivity: reflectivity,
		shading: THREE.SmoothShading,
		envMap: cubeMap,
		skinning: true,
		shading: false
	});

	return material;
}

Materials.createTransparentMaterial = function(color, reflectivity, cubeMap){
	var material = new THREE.MeshPhongMaterial({
		color: color,
		reflectivity: reflectivity,
		shading: THREE.SmoothShading,
		envMap: cubeMap,
		skinning: true,
		shading: false,
		transparent: true,
		opacity: .3
	});

	return material;
}

Materials.createBasicMaterial = function(color){
	var material = new THREE.MeshBasicMaterial({color: color});

	return material;
}