const MessageBoard = artifacts.require("MessageBoard");
const { expect } = require("chai");

contract("MessageBoard", (accounts) => {
    let messageBoard;

    before(async () => {
        messageBoard = await MessageBoard.deployed();
    });

    describe("Posting Messages", () => {
        it("should post a message successfully", async () => {
            const content = "Hello, Blockchain!";
            const tx = await messageBoard.postMessage(content, { from: accounts[0] });

            expect(tx.logs[0].event).to.equal("MessagePosted");
            expect(tx.logs[0].args.content).to.equal(content);
            expect(tx.logs[0].args.author).to.equal(accounts[0]);

            const count = await messageBoard.getMessageCount();
            expect(count.toNumber()).to.equal(1);
        });

        it("should revert when posting empty message", async () => {
            try {
                await messageBoard.postMessage("", { from: accounts[0] });
                expect.fail("Should have reverted");
            } catch (error) {
                expect(error.message).to.include("Content cannot be empty");
            }
        });
    });

    describe("Reading Messages", () => {
        it("should get a message by id", async () => {
            const content = "Second message";
            await messageBoard.postMessage(content, { from: accounts[1] });

            const message = await messageBoard.getMessage(0);
            expect(message.content).to.equal("Hello, Blockchain!");
            expect(message.author).to.equal(accounts[0]);
        });

        it("should revert when getting non-existent message", async () => {
            try {
                await messageBoard.getMessage(999);
                expect.fail("Should have reverted");
            } catch (error) {
                expect(error.message).to.include("Message does not exist");
            }
        });

        it("should get all messages", async () => {
            const allMessages = await messageBoard.getAllMessages();
            expect(allMessages.length).to.be.at.least(2);
        });
    });
});
