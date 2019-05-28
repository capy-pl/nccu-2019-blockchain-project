import Web3 from 'web3';
import ContractABI from '../build/contracts/MemberCertification.json';
import { Contract } from 'web3-eth-contract';
import { EventEmitter } from 'events';

const httpProvider = 'http://127.0.0.1:8545';
const web3 = new Web3(httpProvider);
const contractAddress = '0x81F35D829107aA40Fc4ba62361db20D4c8d7382A';

export function initContract(contractAddress: string, abi: any) {
  const { Contract } = web3.eth;
  return new Contract(abi, contractAddress);
}

interface BN {
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

export interface Certification {
  title: string;
  value: string;
  validFrom: Date;
  validUntil: Date;
  organization: number;
  isCertified: BN; // -1, 1, 0 (reject, valid, pending)
  isPublic: boolean;
}

export interface CertificationResponse extends Certification {
  applicationIndex: number;
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

  public addCertification(title: string, value: string, validFrom: Date, validTo: Date, isPublic: boolean, orgName: string): Promise<void> {
    return this.contract.methods.addCertification(title, value, validFrom, validTo, isPublic, orgName).send({
      from: this.from
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

  public verifyApplication(orgName: string, applicationIndex: string) {
    return this.contract.methods.verifyApplication(orgName, applicationIndex).send({
      from: this.from
    });
  }

  public getApplications(indexList: number[]): Promise<CertificationResponse[]> {
    return Promise.all(indexList.map(number => this.getApplication(number)));
  }

  public AddCertification(object: any): EventEmitter {
  return this.contract.events.AddCertification((object));
  }

  public ApplicationStatusChange(object: any): EventEmitter {
    return this.contract.events.ApplicationStatusChange(object);
  }
}
