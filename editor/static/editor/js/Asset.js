class Asset {
	constructor(template, mesh){
		this.template = template;
		this.mesh = mesh;
		this.uid = Uuid.uuid4();
	}

	flipX(){
		var geometry = this.mesh.geometry;

		// Flip around the x axis
		//this.mesh.geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

		var geometry = this.mesh.geometry;
		var faces = geometry.faces;
		console.log(faces[0]);
		for (var ii = 0; ii < faces.length; ++ii){
			var face = faces[ii];
			var a = face.a;
			face.a = face.c;
			face.c = a;

			var normals = face.vertexNormals;
			var x = normals[0].x;
			var y = normals[0].y;
			var z = normals[0].z;
			normals[0].x = normals[2].x;
			normals[0].y = normals[2].y;
			normals[0].z = normals[2].z;

			normals[0].x = x;
			normals[0].y = y;
			normals[0].z = z;
		}
		console.log(faces[0]);

		geometry.verticesNeedUpdate = true;
		geometry.normalsNeedUpdate = true;
		geometry.computeBoundingSphere();
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();


		console.log(faces[0]);
	}

	updateNormals(){
	}
}