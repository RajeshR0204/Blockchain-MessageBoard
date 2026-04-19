// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MessageBoard {
    struct Message {
        uint256 id;
        string content;
        address author;
        uint256 timestamp;
    }

    Message[] public messages;
    uint256 public messageCount;

    event MessagePosted(uint256 indexed id, string content, address indexed author, uint256 timestamp);

    function postMessage(string calldata _content) public {
        require(bytes(_content).length > 0, "Content cannot be empty");

        messages.push(Message({
            id: messageCount,
            content: _content,
            author: msg.sender,
            timestamp: block.timestamp
        }));

        emit MessagePosted(messageCount, _content, msg.sender, block.timestamp);
        messageCount++;
    }

    function getMessage(uint256 _id) public view returns (uint256 id, string memory content, address author, uint256 timestamp) {
        require(_id < messageCount, "Message does not exist");
        Message memory msg = messages[_id];
        return (msg.id, msg.content, msg.author, msg.timestamp);
    }

    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }

    function getMessageCount() public view returns (uint256) {
        return messageCount;
    }
}
