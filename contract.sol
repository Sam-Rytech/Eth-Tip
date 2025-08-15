// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SocialTippingBase
 * @dev A decentralized tipping system that uses Farcaster API
 */
contract SocialTippingBase {
    struct TipData {
        address sender;
        address recipient;
        uint256 value;
        string note;
        string handle;
        uint256 sentAt;
        bool visible;
    }

    struct Profile {
        uint256 givenTotal;
        uint256 receivedTotal;
        uint256 tipsSent;
        string handle;
    }

    address public contractOwner;
    uint256 public tipsCount;
    uint256 public feesAccumulated;

    uint256 private constant FEE_NUMERATOR = 50; // 0.5%
    uint256 private constant FEE_BASE = 10000;
    uint256 private constant MIN_TIP = 1000; // 1000 wei minimum

    mapping(uint256 => TipData) private tipRecords;
    mapping(address => Profile) private profiles;
    mapping(address => uint256[]) private sentTips;
    mapping(address => uint256[]) private receivedTips;

    event NewTip(
        uint256 indexed id,
        address indexed sender,
        address indexed recipient,
        uint256 value,
        string note,
        bool visible
    );

    event HandleChanged(address indexed user, string newHandle);
    event FeesClaimed(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only owner allowed");
        _;
    }

    modifier validTarget(address target) {
        require(target != address(0), "Invalid address");
        require(target != msg.sender, "Cannot tip yourself");
        _;
    }

    bool private reentrancyLock;
    modifier noReentrancy() {
        require(!reentrancyLock, "Reentrancy detected");
        reentrancyLock = true;
        _;
        reentrancyLock = false;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    function sendTip(
        address to,
        string memory note,
        string memory handle,
        bool publicTip
    ) external payable validTarget(to) noReentrancy {
        require(msg.value >= MIN_TIP, "Tip amount too small");

        uint256 platformCut = (msg.value * FEE_NUMERATOR) / FEE_BASE;
        uint256 payout = msg.value - platformCut;

        tipsCount++;
        tipRecords[tipsCount] = TipData({
            sender: msg.sender,
            recipient: to,
            value: payout,
            note: note,
            handle: handle,
            sentAt: block.timestamp,
            visible: publicTip
        });

        profiles[msg.sender].givenTotal += payout;
        profiles[msg.sender].tipsSent++;
        profiles[to].receivedTotal += payout;

        sentTips[msg.sender].push(tipsCount);
        receivedTips[to].push(tipsCount);

        (bool success, ) = to.call{value: payout}("");
        require(success, "Transfer failed");

        feesAccumulated += platformCut;

        emit NewTip(tipsCount, msg.sender, to, payout, note, publicTip);
    }

    function sendBatchTips(
        address[] memory recipients,
        string memory note,
        string memory handle
    ) external payable noReentrancy {
        uint256 count = recipients.length;
        require(count > 0 && count <= 20, "Invalid recipient count");
        require(msg.value > 0, "No ETH sent");

        uint256 eachTip = msg.value / count;
        require(eachTip >= MIN_TIP, "Each tip too small");

        for (uint256 i = 0; i < count; i++) {
            address recipient = recipients[i];
            require(recipient != address(0) && recipient != msg.sender, "Invalid recipient");

            uint256 platformCut = (eachTip * FEE_NUMERATOR) / FEE_BASE;
            uint256 payout = eachTip - platformCut;

            tipsCount++;
            tipRecords[tipsCount] = TipData({
                sender: msg.sender,
                recipient: recipient,
                value: payout,
                note: note,
                handle: handle,
                sentAt: block.timestamp,
                visible: true
            });

profiles[msg.sender].givenTotal += payout;
            profiles[msg.sender].tipsSent++;
            profiles[recipient].receivedTotal += payout;

            sentTips[msg.sender].push(tipsCount);
            receivedTips[recipient].push(tipsCount);

            (bool success, ) = recipient.call{value: payout}("");
            require(success, "Transfer failed");

            feesAccumulated += platformCut;

            emit NewTip(tipsCount, msg.sender, recipient, payout, note, true);
        }
    }

    function changeHandle(string memory newHandle) external {
        profiles[msg.sender].handle = newHandle;
        emit HandleChanged(msg.sender, newHandle);
    }

    function getPublicTips(uint256 maxCount)
        external
        view
        returns (TipData[] memory tipsList)
    {
        require(maxCount > 0 && maxCount <= 50, "Invalid count");
        uint256 found;
        tipsList = new TipData[](maxCount);

        for (uint256 i = tipsCount; i > 0 && found < maxCount; i--) {
            if (tipRecords[i].visible) {
                tipsList[found] = tipRecords[i];
                found++;
            }
        }

        assembly {
            mstore(tipsList, found)
        }
    }

    function getProfile(address user) external view returns (Profile memory) {
        return profiles[user];
    }

function getSentTips(address user, uint256 offset, uint256 limit)
    external
    view
    returns (uint256[] memory)
{
    require(limit > 0 && limit <= 10, "Invalid limit");
    uint256 total = sentTips[user].length;
    if (offset >= total) return new uint256[](0);

    uint256 end = offset + limit;
    if (end > total) end = total;

    uint256[] memory result = new uint256[](end - offset);
    for (uint256 i = 0; i < result.length; i++) {
        result[i] = sentTips[user][total - 1 - offset - i];
    }
    return result;
}

    function getTip(uint256 id) external view returns (TipData memory) {
        require(id > 0 && id <= tipsCount, "Invalid ID");
        return tipRecords[id];
    }

    function getContractSummary()
        external
        view
        returns (uint256 totalTips, uint256 balance, uint256 fees)
    {
        return (tipsCount, address(this).balance, feesAccumulated);
    }

    function claimFees() external onlyOwner {
        require(feesAccumulated > 0, "No fees");
        uint256 amount = feesAccumulated;
        feesAccumulated = 0;
        (bool success, ) = contractOwner.call{value: amount}("");
        require(success, "Withdraw failed");
        emit FeesClaimed(contractOwner, amount);
    }

    function emergencyWithdrawAll() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw");
        (bool success, ) = contractOwner.call{value: amount}("");
        require(success, "Emergency withdraw failed");
    }

    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        contractOwner = newOwner;
    }

    receive() external payable {}
    fallback() external payable {
        revert("Invalid call");
    }
}