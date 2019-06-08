import Web3 from 'web3';
import ContractABI from '../build/contracts/MemberCertification.json';
import { Contract } from 'web3-eth-contract';
import { EventEmitter } from 'events';

const httpProvider = 'http://127.0.0.1:8545';
const web3 = new Web3(httpProvider);
const contractAddress = '0x10b8C1E01146505e8b06e0ecf9F1973B7E8F59d8';

export function initContract(contractAddress: string, abi: any) {
  const { Contract } = web3.eth;
  return new Contract(abi, contractAddress);
}

export interface BN {
  toNumber: () => number;
}

interface UserInfo {
  name: string;
  id: string;
  ethAddress: string;
  certificationList: number[];
  isPublic: boolean;
  orgNameIfAdmin: string;
}

export interface UserBriefInfo {
  name: string;
  id: string;
}

export interface Certification {
  title: string;
  value: string;
  validFrom: BN;
  validUntil: BN;
  organization: string;
  isCertified: BN; // -1, 1, 0 (reject, valid, pending)
  isPublic: boolean;
}

export interface CertificationResponse extends Certification {
  applicationIndex: BN;
  name: string;
  orgName: string;
}

export default class MemberCertificationContract {
  private from: string;
  private contract: Contract;
  constructor(from: string) {
    this.from = from;
    this.contract = initContract(contractAddress, ContractABI.abi);
  }

  public changeAddress (from: string): void {
    this.from = from;
  }

  public addOrg(name: string, defaultAdmin: string): Promise<void> {
    return this.contract.methods.addOrg(name, defaultAdmin).send({
      from: this.from
    });
  }

  public addMember(name: string, id: string, ethAddress: string, isPublic: boolean): Promise<void> {
    return this.contract.methods.addMember(name, id, ethAddress, isPublic).send({
      from: this.from
    });
  }

  public addCertification(title: string, value: string, validFrom: number, validTo: number, isPublic: boolean, orgName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.contract.methods.addCertification(title, value, validFrom, validTo, isPublic, orgName).send({
        from: this.from,
        gas: 85000000,
        gasPrice: 1
      }, function(err: boolean, receipt: any) {
        if (err) {
          reject();
        } else {
          resolve(receipt);
        }
      }); 
    });
  }

  public getInfo(): Promise<UserInfo> {
    return this.contract.methods.getInfo.call({
      from: this.from
    });
  }

  public getOrgApplicationIndexList(orgName: string): Promise<number[]> {
    return this.contract.methods.getOrgApplicationIndexList(orgName).call({
      from: this.from
    });
  }

  public getApplication(index: number): Promise<CertificationResponse> {
    return this.contract.methods.getApplication(index).call({
      from: this.from
    });
  }

  public verifyApplication(orgName: string, applicationIndex: number): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.contract.methods.verifyApplication(orgName, applicationIndex).send({
        from: this.from,
        gas: 85000000,
        gasPrice: 1
      }, function(err: boolean, receipt: any) {
        if (err) {
          reject();
        } else {
          resolve(receipt);
        }
      });
    })
  }

  public rejectApplication(orgName: string, applicationIndex: number): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.contract.methods.rejectApplication(orgName, applicationIndex).send({
        from: this.from,
        gas: 85000000,
        gasPrice: 1
      }, function (err: boolean, receipt: any) {
        if (err) {
          reject();
        } else {
          resolve(receipt);
        }
      });
    })
  }

  public getApplications(indexList: number[]): Promise<CertificationResponse[]> {
    return Promise.all(indexList.map(number => this.getApplication(number)));
  }

  public issueCertification(id: string, title: string, value: string, validFrom: number, validTo: number, isPublic: boolean, orgName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.contract.methods.issueCertification(id, title, value, validFrom, validTo, isPublic, orgName)
        .send({
          from: this.from,
          gas: 85000000,
          gasPrice: 1
        }, function(err: boolean, receipt: any) {
          if (err) {
            reject(err);
          } else {
            resolve(receipt);
          }
        })
    })
  }

  public getMemberLength(): Promise<BN> {
    return this.contract.methods.getMemberLength().call({
      from: this.from
    });
  }

  public getMemberNameAndId(index: number): Promise<UserBriefInfo> {
    return this.contract.methods.getMemberNameAndId(index).call({
      from: this.from
    });
  }

  public async getMembers(): Promise<UserBriefInfo[]> {
    const len = await this.getMemberLength();
    const members = [];
    for (let i = 0; i < len.toNumber(); i++) {
      members.push(this.getMemberNameAndId(i));
    }
    return await Promise.all(members);
  }

  // public AddCertification(object: any): EventEmitter {
  //   return this.contract.events.AddCertification((object));
  // }

  // public ApplicationStatusChange(object: any): EventEmitter {
  //   return this.contract.events.ApplicationStatusChange(object);
  // }
}
