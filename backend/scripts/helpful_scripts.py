from brownie import network, config, accounts

LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]


def get_account():
    if network.show_active() == "development":
        return accounts[0]
    else:
        private_key = config["networks"][network.show_active()]["private_key"]
        return accounts.add(private_key)