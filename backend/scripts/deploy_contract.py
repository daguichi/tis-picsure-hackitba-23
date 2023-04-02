from brownie import MainContract, ProofOfHumanityMock, network, config
from scripts.helpful_scripts import get_account

def main():
    # Get account

    account = get_account()

    # Deploy PoH contract

    if "poh_address" in config["networks"][network.show_active()]:
        poh_address = config["networks"][network.show_active()]["poh_address"]
    else:
        poh = ProofOfHumanityMock.deploy({"from": account})
        poh_address = poh.address
        print(f"PoH deployed at {poh_address}")

    # Deploy Main contract

    main = MainContract.deploy(poh_address, {"from": account})

    print(f"Main contract deployed at {main.address}")
    
    return main
