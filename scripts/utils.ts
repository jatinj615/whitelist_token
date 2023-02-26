import hre from "hardhat";

export async function verifyContract(contractAddress: string, constructorArguments: any) {
    await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: constructorArguments
    });
}