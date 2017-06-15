function init(){

	window.model = new SceneModel();
	window.view = new SceneView(window.model);

	window.view.init();
	window.view.animate();

	//window.model.initCharacter();

	$("#editor").append(window.view.renderer.domElement);
}

$(document).ready(init);