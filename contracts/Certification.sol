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
        uint[] applications;
        uint applicationCount;
        mapping (address => bool) admins;
    }

    struct Certification {
        string title;
        string value;
        uint validFrom;
        uint validUntil;
        uint organization;
        int isCertified;   // -1, 1, 0 (reject, valid, pending)
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
        require(msg.sender == owner, 'Do not have proper permission.');
        _;
    }

    modifier noDuplicateOrg(string memory orgName) {
        bool hasDuplicate = orgEnrolled[orgName];
        require(hasDuplicate == false, 'Has duplicate organization.');
        _;
    }

    modifier noDuplicateMember(string memory id) {
        bool hasDuplicate = memberEnrolled[id];
        require(hasDuplicate == false, 'Has duplicate member.');
        _;
    }

    modifier orgExist(string memory orgName) {
        bool isExist = orgEnrolled[orgName];
        require(isExist == true, 'Organization does not exist.');
        _;
    }
    
    modifier isOrgAdmin(string memory orgName) {
        Organization storage organization = organizations[searchOrgByName[orgName]];
        bool isAdmin = organization.admins[msg.sender];
        require(isAdmin == true, 'Address is not admin.');
        _;
    }
    
    modifier memberAddressExist(address ethAddress) {
        bool isExist = memberAddressEnrolled[ethAddress];
        require(isExist == true, 'Address not exist.');
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function addOrg(string memory name, address ethAddress,  address defaultAdmin)
    public
    isOwner
    noDuplicateOrg(name) {
        uint[] memory applications;
        searchOrgByName[name] = organizations.length;
        orgEnrolled[name] = true;
        orgList[ethAddress] = organizations.length;
        organizations.push(Organization(name, ethAddress, applications, 0));
        Organization storage organization = getOrgByName(name);
        organization.admins[defaultAdmin] = true;
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
    
    function addAdmin(string memory orgName, address admin)
    orgExist(orgName)
    isOrgAdmin(orgName)
    public
    {
        Organization storage organization = organizations[searchOrgByName[orgName]];
        organization.admins[admin] = true;
    }
    
    function getOrgByName(string memory orgName)
    private
    returns (Organization storage) {
        return organizations[searchOrgByName[orgName]];
    }
    
    function getOrgViewByName(string memory orgName)
    private
    view
    returns (Organization memory) {
        return organizations[searchOrgByName[orgName]];
    }
    
    function getApplications(string memory orgName)
    orgExist(orgName)
    isOrgAdmin(orgName)
    view
    public
    returns (uint[] memory)
    {
        Organization memory organization = getOrgViewByName(orgName);
        Certification[] memory cerfts = certifications;
        uint size = organization.applicationCount;
        uint[]  memory filteredApplication = new uint[](size);
        for (uint i = 0;i < organization.applications.length; i++) {
            Certification memory application = certifications[organization.applications[i]];
            if (application.isCertified == -1) {
                filteredApplication[filteredApplication.length] = organization.applications[i];
            }
        }
        return filteredApplication;
    }
    
    // function getApplication(uint index)
}