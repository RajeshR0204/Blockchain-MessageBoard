import { useState, useEffect } from "react";
import { ethers } from "ethers";
import MessageBoardABI from "./MessageBoard.json";
import "./App.css";

const CONTRACT_ADDRESS = "0x2F3658b5b5e49daCCD120F423bF0a106805fd0cd";

function App() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [messageContent, setMessageContent] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        autoConnectWallet();
    }, []);

    const autoConnectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) {
                    await connectWallet();
                }
            } catch (error) {
                console.error("Auto-connect failed:", error);
            }
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                setIsLoading(true);
                const web3Provider = new ethers.BrowserProvider(window.ethereum);
                const userSigner = await web3Provider.getSigner();
                const userAddress = await userSigner.getAddress();
                

                setProvider(web3Provider);
                setSigner(userSigner);
                setAccount(userAddress);

                const messageContract = new ethers.Contract(CONTRACT_ADDRESS, MessageBoardABI, userSigner);
                setContract(messageContract);
                await loadMessages(messageContract);
                setStatus("Wallet connected successfully!");
            } catch (error) {
                console.error("Connection error:", error);
                setStatus("Failed to connect wallet");
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const loadMessages = async (contractInstance) => {
        try {
            const allMessages = await contractInstance.getAllMessages();
            const formattedMessages = allMessages.map((msg) => ({
                id: msg.id.toString(),
                content: msg.content,
                author: msg.author,
                timestamp: new Date(msg.timestamp * 1000).toLocaleString(),
            }));
            setMessages(formattedMessages.reverse());
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    };

    const postMessage = async () => {
        if (!messageContent.trim()) {
            setStatus("Message cannot be empty");
            return;
        }

        try {
            setIsLoading(true);
            setStatus("Posting message...");
            const tx = await contract.postMessage(messageContent);
            await tx.wait();
            setMessageContent("");
            setStatus("Message posted successfully!");
            await loadMessages(contract);
            setTimeout(() => setStatus(""), 3000);
        } catch (error) {
            console.error("Error posting message:", error);
            setStatus("Failed to post message");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            postMessage();
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <span className="logo-icon">💬</span>
                        <h1>Message Board</h1>
                    </div>
                    <div className="wallet-section">
                        {account ? (
                            <div className="wallet-connected">
                                <span className="wallet-dot"></span>
                                <span className="wallet-address">{account.slice(0, 6)}...{account.slice(-4)}</span>
                            </div>
                        ) : (
                            <button
                                className="btn-connect"
                                onClick={connectWallet}
                                disabled={isLoading}
                            >
                                {isLoading ? "Connecting..." : "Connect Wallet"}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="main-content">
                {status && (
                    <div className={`status-message ${status.includes("Failed") || status.includes("cannot") ? "error" : "success"}`}>
                        {status}
                    </div>
                )}

                <section className="post-section card">
                    <h2>
                        <span className="icon">✏️</span>
                        Post a Message
                    </h2>
                    <div className="input-group">
                        <input
                            type="text"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="What's on your mind?"
                            className="message-input"
                            disabled={isLoading || !account}
                        />
                        <button
                            className="btn-post"
                            onClick={postMessage}
                            disabled={isLoading || !account}
                        >
                            {isLoading ? "Posting..." : "Post"}
                        </button>
                    </div>
                    {!account && (
                        <p className="connect-hint">Connect your wallet to post messages</p>
                    )}
                </section>

                <section className="messages-section card">
                    <h2>
                        <span className="icon">📋</span>
                        Messages
                        <span className="message-count">{messages.length}</span>
                    </h2>

                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">🌟</span>
                            <p>No messages yet.</p>
                            <span className="empty-hint">Be the first to post a message!</span>
                        </div>
                    ) : (
                        <div className="messages-list">
                            {messages.map((msg, index) => (
                                <div key={msg.id} className="message-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="message-header">
                                        <div className="message-author">
                                            <span className="author-avatar">{msg.author.slice(2, 4).toUpperCase()}</span>
                                            <span className="author-address">{msg.author.slice(0, 6)}...{msg.author.slice(-4)}</span>
                                        </div>
                                        <span className="message-time">{msg.timestamp}</span>
                                    </div>
                                    <p className="message-content">{msg.content}</p>
                                    <div className="message-footer">
                                        <span className="message-id">#{msg.id}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <footer className="footer">
                <p>Built with Ethereum & React | Powered by Truffle</p>
            </footer>
        </div>
    );
}

export default App;
