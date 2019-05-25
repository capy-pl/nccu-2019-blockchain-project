pragma solidity ^0.5.1;

contract MemberCertification {
    address private owner;

    struct Member {
        string name;
        string id;
        address ethAddress;
        uint organization;
        uint[] certifications;
        bool isPublic;
    }

    struct Organization {
        string name;
        address ethAddress;
        address[] admins;
        uint[] applications;
    }

    struct Certification {
        string title;
        string value;
        uint validFrom;
        uint validUntil;
        uint organization;
        uint isCertified;   // -1, 1, 0 (reject, valid, pending)
        bool isPublic;
    }

    mapping (address => uint) private memberList;
    mapping (address => uint) private orgList;
    mapping (string => uint) private searchOrgByName;
    mapping (string => uint) private searchMemberById;
    mapping (string => bool) private orgEnrolled;
    mapping (string => bool) private memberEnrolled;
    mapping (address => bool) private memberAddressEnrolled;

    Organization[] public organizations;
    Member[] public members;
    Certification[] public certifications;

    modifier isOwner() {
        require(msg.sender == owner, 'Not have enough permission error.');
        _;
    }

    modifier noDuplicateOrg(string memory orgName) {
        bool hasDuplicate = orgEnrolled[orgName];
        require(hasDuplicate == false, 'Duplicate organization error.');
        _;
    }

    modifier noDuplicateMember(string memory id) {
        bool hasDuplicate = memberEnrolled[id];
        require(hasDuplicate == false, 'Duplicate member error.');
        _;
    }

    modifier orgExist(string memory orgName) {
        bool isExist = orgEnrolled[orgName];
        require(isExist == true, 'Cannot not found organization.');
        _;
    }

    modifier memberAddressExist(address ethAddress) {
        bool isExist = memberAddressEnrolled[ethAddress];
        require(isExist == true, 'Cannot not found the member.');
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function addOrg(string memory name, address ethAddress)
    public
    isOwner
    noDuplicateOrg(name) {
        address[] memory admins;
        uint[] memory applications;
        Organization memory org = Organization(name, ethAddress, admins, applications);
        searchOrgByName[org.name] = organizations.length;
        orgEnrolled[org.name] = true;
        orgList[ethAddress] = organizations.length;
        organizations.push(org);
    }

    function addMember(string memory name, string memory id, address ethAddress, address orgAddress, bool isPublic)
    public
    noDuplicateMember(id)
    {
        uint[] memory certificationIndex;
        Member memory member = Member(name, id, ethAddress, orgList[orgAddress], certificationIndex, isPublic);
        memberEnrolled[id] = true;
        memberAddressEnrolled[ethAddress] = true;
        memberList[ethAddress] = members.length;
        searchMemberById[id] = members.length;
        members.push(member);
    }

    function addCertification(string memory title, string memory value, uint validFrom, uint validUntil, bool isPublic, string memory orgName)
    public
    orgExist(orgName)
    memberAddressExist(msg.sender)
    {
        uint targetOrg = searchOrgByName[orgName];
        Certification memory certification = Certification(title, value, validFrom, validUntil, targetOrg, 0, isPublic);
        Member storage member = members[memberList[msg.sender]];
        organizations[targetOrg].applications.push(certifications.length);
        member.certifications.push(certifications.length);
        certifications.push(certification);
    }
}