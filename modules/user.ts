import MemberCertificationContract, { CertificationResponse, UserBriefInfo } from './library';

export default class User {
  public contract: MemberCertificationContract;
  public name: string;
  public id: string;
  public ethAddress: string;
  public isPublic: boolean;
  public orgNameIfAdmin: string;
  public isAdmin: boolean;
  public certificationList: CertificationResponse[];
  public orgApplicationList: CertificationResponse[];
  public memberList: UserBriefInfo[];
  // public addCertificationListener?: EventEmitter;
  // public applicationStatusChangeListener?: EventEmitter;

  constructor(address: string) {
    this.contract = new MemberCertificationContract(address);
    this.name = '';
    this.id = '';
    this.ethAddress = '';
    this.orgNameIfAdmin = '';
    this.isPublic = false;
    this.isAdmin = false;
    this.certificationList = [];
    this.orgApplicationList = [];
    this.memberList = [];
  }

  public async load(): Promise<void> {
    const test = await this.contract.getInfo();
    const {
      name,
      id,
      ethAddress,
      certificationList,
      isPublic,
      orgNameIfAdmin
    } = test;
    this.name = name;
    this.id = id;
    this.ethAddress = ethAddress;
    this.isPublic = isPublic;
    if (orgNameIfAdmin && orgNameIfAdmin.length) {
      this.orgNameIfAdmin = orgNameIfAdmin;
      this.isAdmin = true;
      await this.loadOrgApplications(orgNameIfAdmin);
      await this.loadMembers();
    } else {
      this.orgNameIfAdmin = '';
      this.isAdmin = false;
    }
    await this.loadCertifcations(certificationList);
  }
  
  public async loadOrgApplications(orgName: string): Promise<void> {
    const indexList = await this.contract.getOrgApplicationIndexList(orgName);
    this.orgApplicationList = await this.loadCertifcations(indexList);
    this.orgApplicationList = this.orgApplicationList.filter(certification => {
      if (certification.isCertified.toNumber() == 0) {
        return true;
      }
      return false;
    });
  }

  public async loadCertifcations(certificationList: number[]): Promise<CertificationResponse[]> {
    const list = await this.contract.getApplications(certificationList);
    this.certificationList = list;
    return list;
  }

  public async loadMembers(): Promise<void> {
    this.memberList = await this.contract.getMembers();
  }
}