from brownie import accounts, MainContract

def test_voting():
    ctr = MainContract.deploy({"from": accounts[0]})

    ctr.registerUser()

    ctr.publishImage("img1")

    ctr.voteImage("img1", 0)

    usr = ctr.getUserByAddress(accounts[0])

    assert usr[1] == 4

    ctr.closeVotation()

    img = ctr.getImageByUrl("img1")

    assert img[0][0] == accounts[0]

    usr = ctr.getUserByAddress(accounts[0])

    assert usr[1] == 6