export type Info = {
    port: number;
    type?: string;
    imei?: string;
    imsi?: string;
    iccid?: string;
    smsc?: string;
    number?: string;
    reg?: string;
}

export type MobileConfig = {
  CLIR: number;
  IsRevPola: number;
  IsGsmOpen: number;
  Micphone: number;
  Handset: number;
  APN: string;
  APNName: string;
  APNPSW: string;
  PortBandType: string;
  SimWorkMode: number;
  bandtypedata: number;
  SMSC: string;
}

export class NumSentBySlot {
    day: number[];
    month: number[];
}

export class Port {

    public active: boolean = true;
    public isResend: boolean = true;
    public info: Info = { port: 0 };
    public mobileConfig: MobileConfig;
    public numSlots: number = 1;
    public activeSlot: number = 1;
    public slotsIndexes: number[] = [];
    public numSentBySlot: NumSentBySlot = new NumSentBySlot();
    public initialIsResend: boolean;
    public initialActive: boolean;
    public limitDay: number;
    public resetDayAt: number;
    public limitMonth: number;
    public resetMonthAt: number;
    public provider: string;
    public alwaysGiveStatus: string;

    constructor(port: number) {
        this.info.port = port;
    }
}
