const { Random } = require("random");
const random = new Random();

async function generateMath(int, isfromrecursion, extravar) {
	return new Promise(async (resolve) => {
		let [Enum, New, rightHand, Recursion] = [random.int(1, 2), int, random.int(1, 999), isfromrecursion ? false : random.int(1, 2) > 1]; //
		let Extra = random.int(1, 999);
		New += Extra;

		switch (Enum) {
			case 1: { // Addition 
				resolve(`((${(New+rightHand)}-${Recursion ? await generateMath(rightHand, true) : rightHand})-${Extra}/${"_INTERNALMATHVAR"}) ${extravar ? `- ${extravar}` : ""}`);
                break;
			}
			case 2: { // Subtraction
				resolve(`((${New-rightHand}+${Recursion ? await generateMath(rightHand, true) : rightHand})-${Extra}/${"_INTERNALMATHVAR"}) ${extravar ? `- ${extravar}` : ""}`);
                break;
			}
		}
	});
}



module.exports = generateMath;