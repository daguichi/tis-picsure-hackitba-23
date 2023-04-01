from brownie import accounts, MainContract, ProofOfHumanityMock, reverts

def test_voting():
    ProofOfHumanityMock.deploy({"from": accounts[0]})
    poh_address = ProofOfHumanityMock[-1].address

    ctr = MainContract.deploy(poh_address, {"from": accounts[0]})

    ctr.registerUser()

    # Publishes and 1 TOK is deduced

    ctr.publishImage("img1", "Test")

    assert ctr.getUserByAddress(accounts[0])[2] == 999

    # Votes positive and 1 TOK is deduced

    ctr.voteImage("img1", 0)

    assert ctr.getUserByAddress(accounts[0])[2] == 998

    # Cant vote twice

    with reverts("Already voted"):
        ctr.voteImage("img1", 0)

    with reverts("Already voted"):
        ctr.voteImage("img1", 1)

    # Votation is closed, 2 TOK and 1 WIN are rewarded

    ctr._closeVotation("img1")

    assert ctr.getUserByAddress(accounts[0])[2] == 1000

    assert ctr.getUserByAddress(accounts[0])[1] == 1

    # Votation status is updated

    img = ctr.getImageByUrl("img1")

    assert img[4] == False