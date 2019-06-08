pragma solidity ^0.5.5;

contract MemberCertification {
    address private owner;

    struct Member {
        string name;
        string id;
        address ethAddress;
        uint[] certifications;
        bool isPublic;
    }

    struct Organization {
        string name;
        uint[] certificateApplications;
        uint applicationCount;
        mapping (address => bool) admins;
    }

    struct Certification {
        string title;
        string value;
        uint validFrom;
        uint validUntil;
        string organization;
        int isCertified;   // -1, 1, 0 (reject, valid, pending)
        bool isPublic;
    }

    event AddCertification (
        string orgName,
        uint index
    );

    event ApplicationStatusChange (
        address ethAddress,
        uint applicationIndex,
        int status
    );

    mapping (address => uint) private memberList;
    mapping (uint => uint) private certificationOwner;
    mapping (string => uint) public searchOrgByName;
    mapping (string => uint) private searchMemberById;
    mapping (string => bool) private orgEnrolled;
    mapping (string => bool) private memberEnrolled;
    mapping (address => bool) private memberAddressEnrolled;
    mapping (address => bool) private isAdminList;
    mapping (address => string) public adminAddressToOrg;

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

    modifier isOrgAdmin(string memory orgName) {
        Organization storage organization = organizations[searchOrgByName[orgName]];
        bool isAdmin = organization.admins[msg.sender];
        require(isAdmin == true, 'Address is not admin.');
        _;
    }

    modifier memberAddressExist(address ethAddress) {
        bool isExist = memberAddressEnrolled[ethAddress];
        require(isExist == true, 'Cannot not found the member.');
        _;
    }

    modifier certificationExist(uint index) {
        require(certifications.length > index, 'Certifcation index out of range');
        _;
    }

    modifier controlledByOrg(string memory orgName, uint index) {
        bool belongsToOrg = false;
        Organization memory organization = getOrgViewByName(orgName);
        for (uint i = 0; i < organization.certificateApplications.length; i++) {
            if (organization.certificateApplications[i] == index) {
                belongsToOrg = true;
                break;
            }
        }
        require(belongsToOrg == true, 'The certifcation is not belongs to the organization');
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function addOrg(string memory name,  address defaultAdmin)
    public
    isOwner
    memberAddressExist(defaultAdmin)
    noDuplicateOrg(name) {
        uint[] memory applications;
        searchOrgByName[name] = organizations.length;
        orgEnrolled[name] = true;
        organizations.push(Organization(name, applications, 0));
        Organization storage organization = getOrgByName(name);
        organization.admins[defaultAdmin] = true;
        isAdminList[defaultAdmin] = true;
        adminAddressToOrg[defaultAdmin] = name;
    }

    function addMember(string memory name, string memory id, address ethAddress, bool isPublic)
    public
    noDuplicateMember(id)
    {
        uint[] memory certificationIndex;
        Member memory member = Member(name, id, ethAddress, certificationIndex, isPublic);
        memberEnrolled[id] = true;
        memberAddressEnrolled[ethAddress] = true;
        memberList[ethAddress] = members.length;
        searchMemberById[id] = members.length;
        members.push(member);
    }

    function compareStrings (string memory a, string memory b)
    public
    pure
    returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
   }

    function addCertification(string memory title, string memory value, uint validFrom, uint validUntil, bool isPublic, string memory orgName)
    public
    orgExist(orgName)
    memberAddressExist(msg.sender)
    {
        uint targetOrg = searchOrgByName[orgName];
        int status = 0;
        Certification memory certification = Certification(title, value, validFrom, validUntil, orgName, status, isPublic);
        Member storage member = members[memberList[msg.sender]];
        organizations[targetOrg].certificateApplications.push(certifications.length);
        member.certifications.push(certifications.length);
        certificationOwner[certifications.length] = memberList[msg.sender];
        organizations[targetOrg].applicationCount += 1;
        certifications.push(certification);
        emit AddCertification(orgName, certifications.length - 1);
    }

    function issueCertification(string memory id,
    string memory title,
    string memory value,
    uint validFrom,
    uint validUntil,
    bool isPublic,
    string memory orgName)
    public
    isOrgAdmin(orgName)
    {
        Certification memory certification = Certification(title, value, validFrom, validUntil, orgName, 1, isPublic);
        Member storage member = members[searchMemberById[id]];
        member.certifications.push(certifications.length);
        certificationOwner[certifications.length] = searchMemberById[id];
        certifications.push(certification);
        emit AddCertification(orgName, certifications.length - 1);
    }

    function addAdmin(string memory orgName, address admin)
    public
    memberAddressExist(admin)
    orgExist(orgName)
    isOrgAdmin(orgName)
    {
        Organization storage organization = organizations[searchOrgByName[orgName]];
        organization.admins[admin] = true;
    }

    function getOrgByName(string memory orgName)
    private
    view
    returns (Organization storage) {
        return organizations[searchOrgByName[orgName]];
    }

    function getOrgViewByName(string memory orgName)
    private
    view
    returns (Organization memory organization) {
        return organizations[searchOrgByName[orgName]];
    }

    function getMemberLength()
    public
    view
    returns (
    uint length
    )
    {
        return members.length;
    }

    function getMemberNameAndId(uint index)
    public
    view
    returns (
    string memory name,
    string memory id
    )
    {
        Member memory member = members[index];
        return (member.name, member.id);
    }
    
    function getInfo ()
    public
    view
    memberAddressExist(msg.sender)
    returns (
    string memory name,
    string memory id,
    address ethAddress,
    uint[] memory certificationList,
    bool isPublic,
    string memory orgNameIfAdmin)
    {
        uint index = memberList[msg.sender];
        Member memory member = members[index];
        return (member.name, member.id, member.ethAddress, member.certifications, member.isPublic, adminAddressToOrg[msg.sender]);
    }

    function getOrgApplicationIndexList(string memory orgName)
    public
    orgExist(orgName)
    isOrgAdmin(orgName)
    view
    returns (uint[] memory)
    {
        Organization memory organization = getOrgViewByName(orgName);
        return organization.certificateApplications;
    }

    function getApplication(uint certificationIndex)
    public
    view
    certificationExist(certificationIndex)
    // applicationIndex, name, title, value, validUntil, validFrom
    returns (
    uint applicationIndex,
    string memory name,
    string memory title,
    string memory value,
    string memory orgName,
    uint validFrom,
    uint validUntil,
    int isCertified,
    bool isPublic
    )
    {
        Certification memory certf = certifications[certificationIndex];
        Member memory member = members[certificationOwner[certificationIndex]];
        return (certificationIndex,
        member.name,
        certf.title,
        certf.value,
        certf.organization,
        certf.validFrom,
        certf.validUntil,
        certf.isCertified,
        certf.isPublic);
    }

    function verifyApplication(string memory orgName, uint applicationIndex)
    public
    orgExist(orgName)
    isOrgAdmin(orgName)
    controlledByOrg(orgName, applicationIndex)
    {
        Certification storage certification = certifications[applicationIndex];
        certification.isCertified = 1;
        emit ApplicationStatusChange(members[certificationOwner[applicationIndex]].ethAddress, applicationIndex, 1);
    }

    function rejectApplication(string memory orgName, uint applicationIndex)
    public
    orgExist(orgName)
    isOrgAdmin(orgName)
    controlledByOrg(orgName, applicationIndex)
    {
        Certification storage certification = certifications[applicationIndex];
        certification.isCertified = -1;
        emit ApplicationStatusChange(members[certificationOwner[applicationIndex]].ethAddress, applicationIndex, -1);
    }
}