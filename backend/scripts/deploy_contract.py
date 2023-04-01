from brownie import MainContract, ProofOfHumanityMock, network, config
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS


def deploy_mocks():
    print(f"The active network is {network.show_active()}")
    print("Deploying Mocks...")
    if len(ProofOfHumanityMock) <= 0:
        ProofOfHumanityMock.deploy({"from": get_account()})
    print("Mocks Deployed!")

def deploy_main():
    # Get account
    account = get_account()

    # Get PoH contract
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        deploy_mocks()
        poh_address = ProofOfHumanityMock[-1].address
    else:
        poh_address = config["networks"][network.show_active()]["poh_address"]

    # Deploy Main contract
    main = MainContract.deploy(
        poh_address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify"),
    )

    print(f"Contract deployed to {main.address}")
    
    return main


def main():
    deploy_main()