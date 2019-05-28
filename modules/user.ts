import MemberCertificationContract, { CertificationResponse } from './library';

export default class User {
  public contract: MemberCertificationContract;
  public name?: string;
  public id?: string;
  public ethAddress?: string;
  public isPublic?: boolean;
  public orgNameIfAdmin?: string;
  public isAdmin?: boolean;
  public certificationList?: CertificationResponse[];
  constructor(address: string) {
    this.contract = new MemberCertificationContract(address);
  }

  public async load(): Promise<void> {
    const {
      name,
      id,
      ethAddress,
      certificationList,
      isPublic,
      orgNameIfAdmin
    } = await this.contract.getInfo();
    this.name = name;
    this.id = id;
    this.ethAddress = ethAddress;
    this.isPublic = isPublic;
    if (orgNameIfAdmin && orgNameIfAdmin.length) {
      this.orgNameIfAdmin = orgNameIfAdmin;
      this.isAdmin = true;
    } else {
      this.orgNameIfAdmin = '';
      this.isAdmin = false;
    }
    await this.loadApplications(certificationList);
  }
  
  public async loadApplications(certificationList: number[]): Promise<CertificationResponse[]> {
    const list = await this.contract.getApplications(certificationList);
    this.certificationList = list;
    return list;
  }
}