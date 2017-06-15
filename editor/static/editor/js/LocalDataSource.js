/* A datasource that is a folder on the same server where DesktopHero is being hosted.
*/

function LocalDataSource(name, directoryURL){
	this.name = name;
	this.topDirectory = directoryURL;
	this.meshesDirectory = directoryURL + '/meshes';
	this.resolution = "medium"
	this.posesDirectory = directoryURL + '/poses';
	this.boneGroupsDirectory = directoryURL + '/bone groups';
	this.presetsDirectory = directoryURL + '/presets';
	this.variationsDirectory = directoryURL + '/variations';
	this.meshes = new ObservableDict();
	this.customMeshes = {};
	this.poses = new ObservableDict();
	this.boneGroups = new ObservableDict();
	this.presets = [];

	// Events
	this.meshesRefreshedEvent = new Event(this);
	this.posesRefreshedEvent = new Event(this);
	this.boneGroupsRefreshedEvent = new Event(this);

	// Populate mesh, pose and bone group lists
	this.refreshMeshesList();
	this.refreshPosesList();
	this.refreshBoneGroupsList();
}

LocalDataSource.jsonLoader = new THREE.JSONLoader();

LocalDataSource.prototype = {
	getMeshes: function(){
		return this.meshes;
	},

	getCustomMeshes: function(){
		return this.customMeshes;
	},

	getPoses: function(){
		return this.poses;
	},

	getBoneGroups: function(){
		return this.boneGroups;
	},

	fetchPreset: function(name, callback){
		var filename = this.presetsDirectory + '/' + name + '.js';
		jQuery.get(filename, function(contents){
			callback(contents);
		});
	},

	addMesh: function(name, author, category, tags, geometry){
		var metadata =  new PoseMetadata(name, author, 'default', category, tags);
		this.customMeshes[name] = {'metadata': metadata, 'geometry': geometry};
	},

	refreshMeshesList: function(){
		this.meshes = new ObservableDict();

		// Torso
		this.meshes['breastplate'] = new MeshMetadata('breastplate', 'stockto2', 'default', 'female shirts', []);
		this.meshes['bunchy cloth shirt'] = new MeshMetadata('bunchy cloth shirt', 'stockto2', 'default', 'female shirts', []);
		this.meshes['cloak top'] = new MeshMetadata('cloak top', 'stockto2', 'default', 'female shirts', []);
		this.meshes['cloth cloak top'] = new MeshMetadata('cloth cloak top', 'stockto2', 'default', 'female shirts', []);
		this.meshes['cloth shirt'] = new MeshMetadata('cloth shirt', 'stockto2', 'default', 'female shirts', []);
		this.meshes['cloth wrap'] = new MeshMetadata('cloth wrap', 'stockto2', 'default', 'female belts', []);
		this.meshes['female torso'] = new MeshMetadata('female torso', 'stockto2', 'default', 'torso', []);
		this.meshes['frilly dress'] = new MeshMetadata('frilly dress', 'stockto2', 'default', 'female shirts', []);
		this.meshes['patterned shirt'] = new MeshMetadata('patterned shirt', 'stockto2', 'default', 'female shirts', []);
		this.meshes['pirate vest'] = new MeshMetadata('pirate vest', 'stockto2', 'default', 'female shirts', []);
		this.meshes['plain tunic'] = new MeshMetadata('plain tunic', 'stockto2', 'default', 'female shirts', []);
		this.meshes['thief\'s shirt'] = new MeshMetadata('thief\'s shirt', 'stockto2', 'default', 'female shirts', []);
		this.meshes['armor w cape'] = new MeshMetadata('armor w cape', 'stockto2', 'default', 'male shirts', []);
		this.meshes['barbarian torso'] = new MeshMetadata('barbarian torso', 'stockto2', 'default', 'male torso', []);
		this.meshes['beggar shirt'] = new MeshMetadata('beggar shirt', 'stockto2', 'default', 'male shirts', []);
		this.meshes['billowing cape'] = new MeshMetadata('billowing cape', 'stockto2', 'default', 'capes', []);
		this.meshes['blacksmith\'s apron'] = new MeshMetadata('blacksmith\'s apron', 'stockto2', 'default', 'male shirts', []);
		this.meshes['cape hood 2'] = new MeshMetadata('cape hood 2', 'stockto2', 'default', 'capes', []);
		this.meshes['cape hood'] = new MeshMetadata('cape hood', 'stockto2', 'default', 'capes', []);
		this.meshes['captain\'s armor'] = new MeshMetadata('captain\'s armor', 'stockto2', 'default', 'male shirts', []);
		this.meshes['chain mail'] = new MeshMetadata('chain mail', 'stockto2', 'default', 'male shirts', []);
		this.meshes['chest strap back a'] = new MeshMetadata('chest strap back a', 'stockto2', 'default', 'male shirts', []);
		this.meshes['chest strap back b'] = new MeshMetadata('chest strap back b', 'stockto2', 'default', 'male shirts', []);
		this.meshes['chest strap front a'] = new MeshMetadata('chest strap front a', 'stockto2', 'default', 'male shirts', []);
		this.meshes['chest strap front b'] = new MeshMetadata('chest strap front b', 'stockto2', 'default', 'male shirts', []);
		this.meshes['cloak cape'] = new MeshMetadata('cloak cape', 'stockto2', 'default', 'capes', []);
		this.meshes['cloak top'] = new MeshMetadata('cloak top', 'stockto2', 'default', 'collars', []);
		this.meshes['cloth belt'] = new MeshMetadata('cloth belt', 'stockto2', 'default', 'belts', []);
		this.meshes['cloth collar'] = new MeshMetadata('cloth collar', 'stockto2', 'default', 'collars', []);
		this.meshes['cloth straps'] = new MeshMetadata('cloth straps', 'stockto2', 'default', 'male shirts', []);
		this.meshes['collar w fastenings'] = new MeshMetadata('collar w fastenings', 'stockto2', 'default', 'collars', []);
		this.meshes['decayed armor'] = new MeshMetadata('decayed armor', 'stockto2', 'default', 'male shirts', []);
		this.meshes['decaying cape 2'] = new MeshMetadata('decaying cape 2', 'stockto2', 'default', 'capes', []);
		this.meshes['decaying cape'] = new MeshMetadata('decaying cape', 'stockto2', 'default', 'capes', []);
		this.meshes['demon torso'] = new MeshMetadata('demon torso', 'stockto2', 'default', 'male torso', []);
		this.meshes['elven tunic'] = new MeshMetadata('elven tunic', 'stockto2', 'default', 'male shirts', []);
		this.meshes['elvin belt'] = new MeshMetadata('elvin belt', 'stockto2', 'default', 'belts', []);
		this.meshes['elvin breastplate'] = new MeshMetadata('elvin breastplate', 'stockto2', 'default', 'male shirts', []);
		this.meshes['elvin cape'] = new MeshMetadata('elvin cape', 'stockto2', 'default', 'capes', []);
		this.meshes['enveloping robes'] = new MeshMetadata('enveloping robes', 'stockto2', 'default', 'male shirts', []);
		this.meshes['fancy cape'] = new MeshMetadata('fancy cape', 'stockto2', 'default', 'capes', []);
		this.meshes['fat belly'] = new MeshMetadata('fat belly', 'stockto2', 'default', 'male torso', []);
		this.meshes['flat collar'] = new MeshMetadata('flat collar', 'stockto2', 'default', 'collars', []);
		this.meshes['flowing cape'] = new MeshMetadata('flowing cape', 'stockto2', 'default', 'capes', []);
		this.meshes['leather armor'] = new MeshMetadata('leather armor', 'stockto2', 'default', 'male shirts', []);
		this.meshes['male torso'] = new MeshMetadata('male torso', 'stockto2', 'default', 'torso', []);
		this.meshes['metal band'] = new MeshMetadata('metal band', 'stockto2', 'default', 'belts', []);
		this.meshes['ninja robe'] = new MeshMetadata('ninja robe', 'stockto2', 'default', 'male shirts', []);
		this.meshes['old cape'] = new MeshMetadata('old cape', 'stockto2', 'default', 'capes', []);
		this.meshes['partial armor'] = new MeshMetadata('partial armor', 'stockto2', 'default', 'male shirts', []);
		this.meshes['patterned armor'] = new MeshMetadata('patterned armor', 'stockto2', 'default', 'male shirts', []);
		this.meshes['piratey vest'] = new MeshMetadata('piratey vest', 'stockto2', 'default', 'male shirts', []);
		this.meshes['plain collar'] = new MeshMetadata('plain collar', 'stockto2', 'default', 'collars', []);
		this.meshes['plate armor'] = new MeshMetadata('plate armor', 'stockto2', 'default', 'male shirts', []);
		this.meshes['regal cape'] = new MeshMetadata('regal cape', 'stockto2', 'default', 'capes', []);
		this.meshes['regal cape thin'] = new MeshMetadata('regal cape thin', 'stockto2', 'default', 'capes', []);
		this.meshes['rumpled shirt'] = new MeshMetadata('rumpled shirt', 'stockto2', 'default', 'male shirts', []);
		this.meshes['sash'] = new MeshMetadata('sash', 'stockto2', 'default', 'belts', []);
		this.meshes['shirt w buckles'] = new MeshMetadata('shirt w buckles', 'stockto2', 'default', 'male shirts', []);
		this.meshes['simple armor'] = new MeshMetadata('simple armor', 'stockto2', 'default', 'male shirts', []);
		this.meshes['simple cape'] = new MeshMetadata('simple cape', 'stockto2', 'default', 'capes', []);
		this.meshes['simple collar'] = new MeshMetadata('simple collar', 'stockto2', 'default', 'collar', []);
		this.meshes['simple tunic'] = new MeshMetadata('simple tunic', 'stockto2', 'default', 'male shirts', []);
		this.meshes['skull pendent'] = new MeshMetadata('skull pendent', 'stockto2', 'default', 'belts', []);
		this.meshes['sorcerer\'s mantle'] = new MeshMetadata('sorcerer\'s mantle', 'stockto2', 'default', 'male shirts', []);
		this.meshes['thick cape'] = new MeshMetadata('thick cape', 'stockto2', 'default', 'capes', []);
		this.meshes['torso w long hair'] = new MeshMetadata('torso w long hair', 'stockto2', 'default', 'male torso', []);
		this.meshes['tunic'] = new MeshMetadata('tunic', 'stockto2', 'default', 'male shirts', []);
		this.meshes['tunic shirt'] = new MeshMetadata('tunic shirt', 'stockto2', 'default', 'male shirts', []);
		this.meshes['windswept cape'] = new MeshMetadata('windswept cape', 'stockto2', 'default', 'capes', []);
		this.meshes['wraith torso'] = new MeshMetadata('wraith torso', 'stockto2', 'default', 'male torso', []);

		// Head
		this.meshes['afro'] = new MeshMetadata('afro', 'stockto2', 'default', 'hair', []);
		this.meshes['antler helmet'] = new MeshMetadata('antler helmet', 'stockto2', 'default', 'headgear', []);
		this.meshes['arctic hood'] = new MeshMetadata('arctic hood', 'stockto2', 'default', 'headgear', []);
		this.meshes['balding hair'] = new MeshMetadata('balding hair', 'stockto2', 'default', 'hair', []);
		this.meshes['basic helmet 2'] = new MeshMetadata('basic helmet 2', 'stockto2', 'default', 'headgear', []);
		this.meshes['basic helmet'] = new MeshMetadata('basic helmet', 'stockto2', 'default', 'headgear', []);
		this.meshes['basic hood'] = new MeshMetadata('basic hood', 'stockto2', 'default', 'headgear', []);
		this.meshes['bearded dwarf'] = new MeshMetadata('bearded dwarf', 'stockto2', 'default', 'head', []);
		this.meshes['bearded male 2'] = new MeshMetadata('bearded male 2', 'stockto2', 'default', 'head', []);
		this.meshes['bearded male'] = new MeshMetadata('bearded male', 'stockto2', 'default', 'head', []);
		this.meshes['bull'] = new MeshMetadata('bull', 'stockto2', 'default', 'head', []);
		this.meshes['captain\'s helmet'] = new MeshMetadata('captain\'s helmet', 'stockto2', 'default', 'headgear', []);
		this.meshes['catlike'] = new MeshMetadata('catlike', 'stockto2', 'default', 'head', []);
		this.meshes['cow'] = new MeshMetadata('cow', 'stockto2', 'default', 'head', []);
		this.meshes['crafty human'] = new MeshMetadata('crafty human', 'stockto2', 'default', 'head', []);
		this.meshes['decaying helmet'] = new MeshMetadata('decaying helmet', 'stockto2', 'default', 'headgear', []);
		this.meshes['demon'] = new MeshMetadata('demon', 'stockto2', 'default', 'head', []);
		this.meshes['double front braid'] = new MeshMetadata('double front braid', 'stockto2', 'default', 'hair', []);
		this.meshes['dwarven'] = new MeshMetadata('dwarven', 'stockto2', 'default', 'head', []);
		this.meshes['elvin helmet'] = new MeshMetadata('elvin helmet', 'stockto2', 'default', 'headgear', []);
		this.meshes['elvin hood'] = new MeshMetadata('elvin hood', 'stockto2', 'default', 'headgear', []);
		this.meshes['elvish'] = new MeshMetadata('elvish', 'stockto2', 'default', 'head', []);
		this.meshes['elvish human'] = new MeshMetadata('elvish human', 'stockto2', 'default', 'head', []);
		this.meshes['elvish male'] = new MeshMetadata('elvish male', 'stockto2', 'default', 'head', []);
		this.meshes['female head'] = new MeshMetadata('female head', 'stockto2', 'default', 'head', []);
		this.meshes['griffon'] = new MeshMetadata('griffon', 'stockto2', 'default', 'head', []);
		this.meshes['hair parted smooth'] = new MeshMetadata('hair parted smooth', 'stockto2', 'default', 'hair', []);
		this.meshes['horns'] = new MeshMetadata('horns', 'stockto2', 'default', 'head', []);
		this.meshes['lich head'] = new MeshMetadata('lich head', 'stockto2', 'default', 'head', []);
		this.meshes['long beard tufts'] = new MeshMetadata('long beard tufts', 'stockto2', 'default', 'beards', []);
		this.meshes['long front braids'] = new MeshMetadata('long front braids', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair braids messy'] = new MeshMetadata('long hair braids messy', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair falling to side'] = new MeshMetadata('long hair falling to side', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair forward'] = new MeshMetadata('long hair forward', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair messy'] = new MeshMetadata('long hair messy', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair simple'] = new MeshMetadata('long hair simple', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair sleek'] = new MeshMetadata('long hair sleek', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair sleek w braids'] = new MeshMetadata('long hair sleek w braids', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair smooth'] = new MeshMetadata('long hair smooth', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair sleek 2'] = new MeshMetadata('long hair sleek 2', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair smooth wave'] = new MeshMetadata('long hair smooth wave', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair styled'] = new MeshMetadata('long hair styled', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair thick'] = new MeshMetadata('long hair thick', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair thick waves'] = new MeshMetadata('long hair thick waves', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair tucked ear'] = new MeshMetadata('long hair tucked ear', 'stockto2', 'default', 'hair', []);
		this.meshes['long hair windswept'] = new MeshMetadata('long hair windswept', 'stockto2', 'default', 'hair', []);
		this.meshes['male head'] = new MeshMetadata('male head', 'stockto2', 'default', 'head', []);
		this.meshes['middle aged human'] = new MeshMetadata('middle aged human', 'stockto2', 'default', 'head', []);
		this.meshes['ninja mask bottom'] = new MeshMetadata('ninja mask bottom', 'stockto2', 'default', 'headgear', []);
		this.meshes['pigtails'] = new MeshMetadata('pigtails', 'stockto2', 'default', 'hair', []);
		this.meshes['pointy cap'] = new MeshMetadata('pointy cap', 'stockto2', 'default', 'headgear', []);
		this.meshes['pointy hood'] = new MeshMetadata('pointy hood', 'stockto2', 'default', 'headgear', []);
		this.meshes['ponytail messy'] = new MeshMetadata('ponytail messy', 'stockto2', 'default', 'hair', []);
		this.meshes['pre-bearded human'] = new MeshMetadata('pre-bearded human', 'stockto2', 'default', 'head', []);
		this.meshes['seargent\'s helmet'] = new MeshMetadata('seargent\'s helmet', 'stockto2', 'default', 'headgear', []);
		this.meshes['short hair messy'] = new MeshMetadata('short hair messy', 'stockto2', 'default', 'hair', []);
		this.meshes['short hair mop'] = new MeshMetadata('short hair mop', 'stockto2', 'default', 'hair', []);
		this.meshes['short hair stiff'] = new MeshMetadata('short hair stiff', 'stockto2', 'default', 'hair', []);
		this.meshes['short hair stiff with braids'] = new MeshMetadata('short hair stiff with braids', 'stockto2', 'default', 'hair', []);
		this.meshes['short streaked beard'] = new MeshMetadata('short streaked beard', 'stockto2', 'default', 'beards', []);
		this.meshes['shoulder-length straight hair'] = new MeshMetadata('shoulder-length straight hair', 'stockto2', 'default', 'hair', []);
		this.meshes['sideburns'] = new MeshMetadata('sideburns', 'stockto2', 'default', 'beards', []);
		this.meshes['simple head 2'] = new MeshMetadata('simple head 2', 'stockto2', 'default', 'head', []);
		this.meshes['simple head'] = new MeshMetadata('simple head', 'stockto2', 'default', 'head', []);
		this.meshes['simple mask'] = new MeshMetadata('simple mask', 'stockto2', 'default', 'headgear', []);
		this.meshes['skinny hood'] = new MeshMetadata('skinny hood', 'stockto2', 'default', 'headgear', []);
		this.meshes['slicked back'] = new MeshMetadata('slicked back', 'stockto2', 'default', 'hair', []);
		this.meshes['soldier helmet'] = new MeshMetadata('soldier helmet', 'stockto2', 'default', 'headgear', []);
		this.meshes['specter'] = new MeshMetadata('specter', 'stockto2', 'default', 'head', []);
		this.meshes['stern human'] = new MeshMetadata('stern human', 'stockto2', 'default', 'head', []);
		this.meshes['straight hair parted'] = new MeshMetadata('straight hair parted', 'stockto2', 'default', 'hair', []);
		this.meshes['straight hair unkempt'] = new MeshMetadata('straight hair unkempt', 'stockto2', 'default', 'hair', []);
		this.meshes['swept to side'] = new MeshMetadata('swept to side', 'stockto2', 'default', 'hair', []);
		this.meshes['test'] = new MeshMetadata('test', 'stockto2', 'default', 'headgear', []);
		this.meshes['undead'] = new MeshMetadata('undead', 'stockto2', 'default', 'head', []);
		this.meshes['winged helmet'] = new MeshMetadata('winged helmet', 'stockto2', 'default', 'headgear', []);

		// Arms
		this.meshes['muscled arm left'] = new MeshMetadata('muscled arm left', 'stockto2', 'default', 'arms', []);
		this.meshes['normal arm left'] = new MeshMetadata('normal arm left', 'stockto2', 'default', 'arms', []);
		this.meshes['muscled arm right'] = new MeshMetadata('muscled arm right', 'stockto2', 'default', 'arms', []);
		this.meshes['normal arm right'] = new MeshMetadata('normal arm right', 'stockto2', 'default', 'arms', []);
			
		// Hands
		this.meshes['left hand closed'] = new MeshMetadata('left hand closed', 'stockto2', 'default', 'hands', []);
		this.meshes['left hand open'] = new MeshMetadata('left hand open', 'stockto2', 'default', 'hands', []);
		this.meshes['right hand closed'] = new MeshMetadata('right hand closed', 'stockto2', 'default', 'hands', []);
		this.meshes['right hand open'] = new MeshMetadata('right hand open', 'stockto2', 'default', 'hands', []);
		this.meshes['small left hand closed'] = new MeshMetadata('small left hand closed', 'stockto2', 'default', 'hands', []);
		this.meshes['small left hand open'] = new MeshMetadata('small left hand open', 'stockto2', 'default', 'hands', []);
		this.meshes['small right hand closed'] = new MeshMetadata('small right hand closed', 'stockto2', 'default', 'hands', []);
		this.meshes['small right hand open'] = new MeshMetadata('small right hand open', 'stockto2', 'default', 'hands', []);

		// Weapons
		this.meshes['bone'] = new MeshMetadata('bone', 'stockto2', 'default', 'items', []);
		this.meshes['book'] = new MeshMetadata('book', 'stockto2', 'default', 'items', []);
		this.meshes['elvin shield'] = new MeshMetadata('elvin shield', 'stockto2', 'default', 'shields', []);
		this.meshes['simple shield'] = new MeshMetadata('simple shield', 'stockto2', 'default', 'shields', []);
		this.meshes['skull'] = new MeshMetadata('skull', 'stockto2', 'default', 'items', []);
		this.meshes['triangle shield'] = new MeshMetadata('triangle shield', 'stockto2', 'default', 'shields', []);
		this.meshes['assassin\'s knife'] = new MeshMetadata('assassin\'s knife', 'stockto2', 'default', 'weapons', []);
		this.meshes['barbarian\'s axe'] = new MeshMetadata('barbarian\'s axe', 'stockto2', 'default', 'weapons', []);
		this.meshes['basic sword'] = new MeshMetadata('basic sword', 'stockto2', 'default', 'weapons', []);
		this.meshes['bone club'] = new MeshMetadata('bone club', 'stockto2', 'default', 'weapons', []);
		this.meshes['decayed sword'] = new MeshMetadata('decayed sword', 'stockto2', 'default', 'weapons', []);
		this.meshes['gnarled staff'] = new MeshMetadata('gnarled staff', 'stockto2', 'default', 'weapons', []);
		this.meshes['knife'] = new MeshMetadata('knife', 'stockto2', 'default', 'weapons', []);
		this.meshes['long spear'] = new MeshMetadata('long spear', 'stockto2', 'default', 'weapons', []);
		this.meshes['longbow 2'] = new MeshMetadata('longbow 2', 'stockto2', 'default', 'weapons', []);
		this.meshes['longbow'] = new MeshMetadata('longbow', 'stockto2', 'default', 'weapons', []);
		this.meshes['machete 2'] = new MeshMetadata('machete 2', 'stockto2', 'default', 'weapons', []);
		this.meshes['machete'] = new MeshMetadata('machete', 'stockto2', 'default', 'weapons', []);
		this.meshes['pistol'] = new MeshMetadata('pistol', 'stockto2', 'default', 'weapons', []);
		this.meshes['short lance'] = new MeshMetadata('short lance', 'stockto2', 'default', 'weapons', []);
		this.meshes['short spear'] = new MeshMetadata('short spear', 'stockto2', 'default', 'weapons', []);
		this.meshes['shortsword'] = new MeshMetadata('shortsword', 'stockto2', 'default', 'weapons', []);
		this.meshes['wooden staff'] = new MeshMetadata('wooden staff', 'stockto2', 'default', 'weapons', []);
		this.meshes['feathered wings'] = new MeshMetadata('feathered wings', 'stockto2', 'default', 'wings', []);
		this.meshes['quiver'] = new MeshMetadata('quiver', 'stockto2', 'default', 'items', []);
		this.meshes['quiver with bow'] = new MeshMetadata('quiver with bow', 'stockto2', 'default', 'items', []);
		this.meshes['steam pack'] = new MeshMetadata('steam pack', 'stockto2', 'default', 'items', []);

		// Legs
		this.meshes['animal pelt skirt'] = new MeshMetadata('animal pelt skirt', 'stockto2', 'default', 'skirts', []);
		this.meshes['armored leg guard 2'] = new MeshMetadata('armored leg guard 2', 'stockto2', 'default', 'legwear', []);
		this.meshes['armored leg guard'] = new MeshMetadata('armored leg guard', 'stockto2', 'default', 'legwear', []);
		this.meshes['armored pants'] = new MeshMetadata('armored pants', 'stockto2', 'default', 'skirts', []);
		this.meshes['armored robe'] = new MeshMetadata('armored robe', 'stockto2', 'default', 'robes', []);
		this.meshes['armored skirt 2'] = new MeshMetadata('armored skirt 2', 'stockto2', 'default', 'skirts', []);
		this.meshes['armored skirt 3'] = new MeshMetadata('armored skirt 3', 'stockto2', 'default', 'skirts', []);
		this.meshes['armored skirt'] = new MeshMetadata('armored skirt', 'stockto2', 'default', 'skirts', []);
		this.meshes['baggy pants'] = new MeshMetadata('baggy pants', 'stockto2', 'default', 'pants', []);
		this.meshes['box'] = new MeshMetadata('box', 'stockto2', 'default', 'misc', []);
		this.meshes['cloth leggings'] = new MeshMetadata('cloth leggings', 'stockto2', 'default', 'pants', []);
		this.meshes['decaying leg guard'] = new MeshMetadata('decaying leg guard', 'stockto2', 'default', 'legwear', []);
		this.meshes['decaying metal girdle'] = new MeshMetadata('decaying metal girdle', 'stockto2', 'default', 'skirts', []);
		this.meshes['elegant dress 2'] = new MeshMetadata('elegant dress 2', 'stockto2', 'default', 'robes', []);
		this.meshes['elegant dress'] = new MeshMetadata('elegant dress', 'stockto2', 'default', 'robes', []);
		this.meshes['elvin boots'] = new MeshMetadata('elvin boots', 'stockto2', 'default', 'footwear', []);
		this.meshes['elvin guard'] = new MeshMetadata('elvin guard', 'stockto2', 'default', 'skirts', []);
		this.meshes['female legs'] = new MeshMetadata('female legs', 'stockto2', 'default', 'legs', []);
		this.meshes['giant feet'] = new MeshMetadata('giant feet', 'stockto2', 'default', 'feet', []);
		this.meshes['knee-length robe bottom'] = new MeshMetadata('knee-length robe bottom', 'stockto2', 'default', 'robes', []);
		this.meshes['leather girdle'] = new MeshMetadata('leather girdle', 'stockto2', 'default', 'skirts', []);
		this.meshes['leather guard'] = new MeshMetadata('leather guard', 'stockto2', 'default', 'skirts', []);
		this.meshes['legs'] = new MeshMetadata('legs', 'stockto2', 'default', 'legs', []);
		this.meshes['long pants'] = new MeshMetadata('long pants', 'stockto2', 'default', 'pants', []);
		this.meshes['metal girdle'] = new MeshMetadata('metal girdle', 'stockto2', 'default', 'skirts', []);
		this.meshes['metal guard'] = new MeshMetadata('metal guard', 'stockto2', 'default', 'skirts', []);
		this.meshes['metal loin wrap'] = new MeshMetadata('metal loin wrap', 'stockto2', 'default', 'skirts', []);
		this.meshes['pants boot tops'] = new MeshMetadata('pants boot tops', 'stockto2', 'default', 'legwear', []);
		this.meshes['pants top 2'] = new MeshMetadata('pants top 2', 'stockto2', 'default', 'pants', []);
		this.meshes['pants top'] = new MeshMetadata('pants top', 'stockto2', 'default', 'pants', []);
		this.meshes['plain boots'] = new MeshMetadata('plain boots', 'stockto2', 'default', 'footwear', []);
		this.meshes['priestly robe'] = new MeshMetadata('priestly robe', 'stockto2', 'default', 'robes', []);
		this.meshes['short boots 2'] = new MeshMetadata('short boots 2', 'stockto2', 'default', 'footwear', []);
		this.meshes['short boots'] = new MeshMetadata('short boots', 'stockto2', 'default', 'footwear', []);
		this.meshes['short robe 2'] = new MeshMetadata('short robe 2', 'stockto2', 'default', 'robes', []);
		this.meshes['short robe'] = new MeshMetadata('short robe', 'stockto2', 'default', 'robes', []);
		this.meshes['side skirt'] = new MeshMetadata('side skirt', 'stockto2', 'default', 'robes', []);
		this.meshes['side skirt double'] = new MeshMetadata('side skirt double', 'stockto2', 'default', 'robes', []);
		this.meshes['simple leg guard'] = new MeshMetadata('simple leg guard', 'stockto2', 'default', 'legwear', []);
		this.meshes['simple robe'] = new MeshMetadata('simple robe', 'stockto2', 'default', 'robes', []);
		this.meshes['simple shoes'] = new MeshMetadata('simple shoes', 'stockto2', 'default', 'footwear', []);
		this.meshes['simple skirt'] = new MeshMetadata('simple skirt', 'stockto2', 'default', 'skirts', []);
		this.meshes['slit robe'] = new MeshMetadata('slit robe', 'stockto2', 'default', 'robes', []);
		this.meshes['steel girdle'] = new MeshMetadata('steel girdle', 'stockto2', 'default', 'skirts', []);
		this.meshes['tight leggings'] = new MeshMetadata('tight leggings', 'stockto2', 'default', 'pants', []);
		this.meshes['trailing robe'] = new MeshMetadata('trailing robe', 'stockto2', 'default', 'robes', []);
		this.meshes['wizardly robes'] = new MeshMetadata('wizardly robes', 'stockto2', 'default', 'robes', []);
		this.meshes['woodsman boots'] = new MeshMetadata('woodsman boots', 'stockto2', 'default', 'footwear', []);
		this.meshes['wraith robe'] = new MeshMetadata('wraith robe', 'stockto2', 'default', 'robes', []);

		this.meshes['thick neck'] = new MeshMetadata('thick neck', 'stockto2', 'default', 'neck', []);
		this.meshes['thin neck'] = new MeshMetadata('thin neck', 'stockto2', 'default', 'neck', []);

		// Platforms
		this.meshes['smooth circular platform'] = new MeshMetadata('smooth circular platform', 'stockto2', 'default', 'platforms', []);

		this.meshesRefreshedEvent.notify(this.meshes);
	},

	refreshPosesList: function(){
		this.poses = new ObservableDict();

		this.poses.put('legs charge', new PoseMetadata('legs charge', 'stockto2', 'default', 'legs'));
		this.poses.put('legs crouching', new PoseMetadata('legs crouching', 'stockto2', 'default', 'legs'));
		this.poses.put('legs right leg step', new PoseMetadata('legs right leg step', 'stockto2', 'default', 'legs'));
		this.poses.put('legs weight shifted', new PoseMetadata('legs weight shifted', 'stockto2', 'default', 'legs'));
		this.poses.put('standing on one leg', new PoseMetadata('standing on one leg', 'stockto2', 'default', 'legs'));
		this.poses.put('legs default', new PoseMetadata('legs default', 'stockto2', 'default', 'legs'));

		this.poses.put('left hand on hip', new PoseMetadata('left hand on hip', 'stockto2', 'default', 'arms'));
		this.poses.put('right arm out', new PoseMetadata('right arm out', 'stockto2', 'default', 'arms'));
		this.poses.put('right hand on chest', new PoseMetadata('right hand on chest', 'stockto2', 'default', 'arms'));
		this.poses.put('right hand outstretched', new PoseMetadata('right hand outstretched', 'stockto2', 'default', 'arms'));

		this.poses.put('torso double hand thrust', new PoseMetadata('torso double hand thrust', 'stockto2', 'default', 'torso'));
		this.poses.put('torso charge', new PoseMetadata('torso charge', 'stockto2', 'default', 'torso'));
		this.poses.put('torso hold weapon', new PoseMetadata('torso hold weapon', 'stockto2', 'default', 'torso'));
		this.poses.put('torso standing ready', new PoseMetadata('torso standing ready', 'stockto2', 'default', 'torso'));
		this.poses.put('torso thrust weapon', new PoseMetadata('torso thrust weapon', 'stockto2', 'default', 'torso'));
		this.poses.put('torso default', new PoseMetadata('torso default', 'stockto2', 'default', 'torso'));

		this.poses.put('head bowed', new PoseMetadata('head bowed', 'stockto2', 'default', 'head'));
		this.poses.put('head looking left', new PoseMetadata('head looking left', 'stockto2', 'default', 'head'));
		this.poses.put('head looking right', new PoseMetadata('head looking right', 'stockto2', 'default', 'head'));
		this.poses.put('head looking up', new PoseMetadata('head looking up', 'stockto2', 'default', 'head'));
		this.poses.put('head looking up left', new PoseMetadata('head looking up left', 'stockto2', 'default', 'head'));
		this.poses.put('head looking up right', new PoseMetadata('head looking up right', 'stockto2', 'default', 'head'));
		this.poses.put('head default', new PoseMetadata('head default', 'stockto2', 'default', 'head'));

		this.posesRefreshedEvent.notify(this.poses);
	},

	refreshBoneGroupsList: function(){
		this.boneGroups = new ObservableDict();
		
		this.boneGroups.put('left arm', new BoneGroupMetadata('left arm', 'dutchmogul', 'default', 'arm', ['cool', 'great'], ['arms', 'custom']));
		this.boneGroups.put('right arm', new BoneGroupMetadata('right arm', 'dutchmogul', 'default', 'arm', ['cool', 'great'], ['arms', 'custom']));
		this.boneGroups.put('left hand', new BoneGroupMetadata('left hand', 'dutchmogul', 'default', 'hands', ['cool', 'great'], ['hands', 'custom']));
		this.boneGroups.put('right hand', new BoneGroupMetadata('right hand', 'dutchmogul', 'default', 'arm', ['cool', 'great'], ['hands', 'custom']));
		this.boneGroups.put('male torso', new BoneGroupMetadata('male torso', 'dutchmogul', 'default', 'torso', ['cool', 'great'], ['torso', 'male torso', 'male shirts', 'belts', 'collars', 'capes', 'accessories', 'custom']));
		this.boneGroups.put('female torso', new BoneGroupMetadata('female torso', 'dutchmogul', 'default', 'torso', ['cool', 'great'], ['torso', 'male shirts', 'capes', 'male shirts', 'female shirts', 'accessories', 'belts', 'collars', 'custom']));
		this.boneGroups.put('head', new BoneGroupMetadata('head', 'dutchmogul', 'default', 'head', ['cool', 'great'], ['headgear', 'head', 'hair', 'accessories', 'custom']));
		this.boneGroups.put('neck', new BoneGroupMetadata('neck', 'dutchmogul', 'default', 'neck', ['cool', 'great'], ['neck', 'accessories', 'custom']));
		this.boneGroups.put('legs', new BoneGroupMetadata('legs', 'dutchmogul', 'default', 'legs', ['cool', 'great'], ['legs', 'skirts', 'robes', 'pants', 'legwear', 'footwear', 'custom']));

		this.boneGroups.put('platform', new BoneGroupMetadata('platform', 'dutchmogul', 'default', 'platform', ['cool', 'great'], ['platforms', 'custom']));
		this.boneGroups.put('item', new BoneGroupMetadata('item', 'dutchmogul', 'default', 'item', ['cool', 'great'], ['accessories', 'items', 'wings', 'shields', 'custom']));
		this.boneGroups.put('weapon', new BoneGroupMetadata('weapon', 'dutchmogul', 'default', 'weapon', ['cool', 'great'], ['weapons', 'custom']));

		this.boneGroupsRefreshedEvent.notify(this.boneGroups);
	},

	fetchPreset: function(name, callback){
		var filename = this.presetsDirectory + '/' + name + '.txt';
		jQuery.get(filename, function(contents){
			callback(contents);
		});
	},

	fetchMesh: function(name, callback){
		var self = this;

		// Check in custom meshes
		if (name in self.customMeshes){
			var geometry = self.customMeshes[name]['geometry'];

			if (!'skinIndices' in geometry){
				// This geometry has no skinning information, follow first bone
				geometry.skinIndices = [];
				geometry.skinWeights = [];
				for (var i = 0; i < geometry.vertices.length; i++){
					geometry.skinIndices.push(new THREE.Vector4(1, 0, 0, 0));
					geometry.skinWeights.push(new THREE.Vector4(1, 0, 0, 0));
				}
			}

			var mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial([]));
			mesh.meshName = name;
			mesh.libraryName = self.name;

			mesh.frustumCulled = false;
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();
			mesh.castShadow = true;
			mesh.receiveShadow = true;

			callback(name, mesh);
			return;
		}

		// Otherwise, load the file
		var filename = this.meshesDirectory + '/' + this.resolution + "/" + name + '.js';

		LocalDataSource.jsonLoader.load(filename, function(geometry, materials){
			//materials[0].skinning = true;

			var mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial([]));
			mesh.meshName = name;
			mesh.libraryName = self.name;

			mesh.frustumCulled = false;
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();
			mesh.castShadow = true;
			mesh.receiveShadow = true;

			callback(name, mesh);
		});
	},

	fetchPose: function(name, callback){
		var filename = this.posesDirectory + '/' + name + '.txt';
		jQuery.get(filename, function(contents){
			callback(contents);
		});
	},

	fetchVariation: function(name, callback){
		var filename = this.variationsDirectory + '/' + name + '.txt';
		jQuery.get(filename, function(contents){
			callback(contents);
		});
	},

	fetchBoneGroup: function(boneGroupName, callback){
		var self = this;
		var filename = this.boneGroupsDirectory + '/' + boneGroupName + '.js';
		LocalDataSource.jsonLoader.load(filename, function(geometry, materials){
			// Get skeleton out of geometry.
			var mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
			var skeleton = mesh.skeleton;

			// Construct new bone group with skeleton.
			var boneGroup = new BoneGroup(boneGroupName, self.name, skeleton);
			boneGroup.metadata = self.boneGroups.get(boneGroupName);
			callback(boneGroup);
		});
	}
}

function MeshMetadata(name, author, library, type, tags){
	this.name = name;
	this.author = author;
	this.library = library;
	this.type = type;
	this.tags = tags;
}

function PoseMetadata(name, author, library, type, tags){
	this.name = name;
	this.author = author;
	this.library = library;
	this.type = type;
	this.tags = tags;
}

function BoneGroupMetadata(name, author, library, type, tags, compatibleTypes){
	this.name = name;
	this.author = author;
	this.library = library;
	this.type = type;
	this.tags = tags;
	this.compatibleTypes = compatibleTypes;
}