// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SkillsRegistry {
    struct Credential {
        uint256 id;
        address student;
        address issuer;
        string courseName;
        uint256 issueDate;
        uint256 expirationDate;
        bool revoked;
    }

    uint256 private _nextId;
    mapping(uint256 => Credential) public credentials;
    mapping(address => bool) public authorizedIssuers;

    event CredentialIssued(uint256 indexed id, address indexed issuer, address indexed student);
    event CredentialRevoked(uint256 indexed id);
    event IssuerAdded(address indexed issuer);

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Caller is not an authorized issuer");
        _;
    }

    constructor() {
        // The deployer is implicitly an authorized issuer or admin
        authorizedIssuers[msg.sender] = true;
    }

    function addIssuer(address _issuer) external {
        // Only existing issuers (or admin) can add new issuers for this MVP
        require(authorizedIssuers[msg.sender], "Only authorized issuers can add new issuers");
        authorizedIssuers[_issuer] = true;
        emit IssuerAdded(_issuer);
    }

    function issueCredential(
        address _student,
        string memory _courseName,
        uint256 _issueDate,
        uint256 _expirationDate
    ) external onlyIssuer {
        uint256 id = _nextId++;
        
        credentials[id] = Credential({
            id: id,
            student: _student,
            issuer: msg.sender,
            courseName: _courseName,
            issueDate: _issueDate,
            expirationDate: _expirationDate,
            revoked: false
        });

        emit CredentialIssued(id, msg.sender, _student);
    }

    function revokeCredential(uint256 _id) external onlyIssuer {
        require(credentials[_id].issuer == msg.sender, "Only the issuer can revoke this credential");
        credentials[_id].revoked = true;
        emit CredentialRevoked(_id);
    }
}
