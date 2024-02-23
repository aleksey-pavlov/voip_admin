export class ProcessInfo {

    public name: string = "";
    public pid: number = 0;
    public monit_cpu: number = 0;
    public running: boolean = false;
    private pending: boolean = false;

    get monit_mem(): number {
        return Math.round(this._monit_mem / 1024 / 1024);
    }
    set monit_mem(mem: number) {
        this._monit_mem = mem;
    }
    private _monit_mem: number = 0;
    constructor(source: ProcessInfoSource) {

        this.name = source.name || this.name;
        this.pid = source.pid || this.pid;
        if (this.pid > 0) {
            this.running = true;
        }
        if (source.monit) {
            this.monit_cpu = source.monit.cpu || this.monit_cpu;
            this.monit_mem = source.monit.memory || this._monit_mem;
        }
    }

    public setPending() {
        this.pending = true;
    }

    public getPending() {
        return this.pending;
    }
}

export interface ProcessInfoSource {
    pid: number;
    name: string;
    pm2_env: {};
    pm_id: number;
    monit: Monit;
}

export interface Monit {
    memory: number;
    cpu: number;
}

export var GmsProviders = ['beeline', 'tele2', 'megafon', 'mts', 'undefined'];
