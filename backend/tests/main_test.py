from brownie import accounts, MyContract

def test_account_balance():
    ctr = MyContract.deploy({"from": accounts[0]})

    ctr.registerUser()

    ctr.publishImage("img1")

    ctr.voteImage("img1", 0)

    img = ctr.getImageByUrl("img1")

    assert img[0][0] == accounts[0]