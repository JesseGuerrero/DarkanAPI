export class Utils {
    static formatNameForProtocol(name: string) {
        name = name.replace(/ /g, '_');
		name = name.toLowerCase();
        return name;
    }
    
    static formatNameForDisplay(name: string) {
        let newName = '';
        name = name.replace(/_/g, ' ');
		name = name.toLowerCase();
        let wasSpace = true;
        for (let i = 0; i < name.length; i++) {
			if (wasSpace) {
				newName += ('' + name.charAt(i)).toUpperCase();
				wasSpace = false;
			} else {
				newName += name.charAt(i);
			}
			if (name.charAt(i) == ' ') {
				wasSpace = true;
			}
		}
		return newName
    }

	static SKILL_XP = [-1, 0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10_824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184_040, 203254, 224466, 247886, 273742, 302288, 333804, 368_599, 407015, 449428, 496254, 547953, 605032, 668051, 737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1_629_200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294, 4385776, 4842295, 5_346_332, 5902831, 6517253, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13_034_431, 14391160, 15889109, 17542976, 19368992, 21385073, 23611006, 26068632, 28782069, 31777943, 35085654, 38737661, 42769801, 47221641, 52136869, 57563718, 63555443, 70_170840, 77_474828, 85_539082, 94_442_737, 104_273_167]
	static getSkillLevelByXP(targetXp, skillID) {
		let top = 99;
		if(skillID == 24)
			top = 120
		for (let i = top;i > 0; i--)
			if (targetXp > (Utils.SKILL_XP)[i])
				return i;
		return 1;
	}


}
