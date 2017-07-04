class Asset {
	constructor(template, mesh){
		this.template = template;
		this.mesh = mesh;
		this.uid = Uuid.uuid4();
	}
}