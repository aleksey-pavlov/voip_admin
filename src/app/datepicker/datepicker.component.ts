import {Component, EventEmitter, Input, Output} from "@angular/core";
import * as moment from "moment";

@Component({
    selector : "datepicker",
    templateUrl : "./datepicker.component.html",
    styleUrls: ["./datepicker.component.css"]   
})
export class DatepickerComponent
{
    public months = [];
    public dates = [];

    public selectedYear: number;
    public selectedMonth: string;
    public selectedDate: number;

    public format: string = "YYYY-MM-DD";
    public hours: string = "12:00:00";

    @Output() onSelectDate = new EventEmitter();
    @Input() inputDate: string;   

    ngOnInit()
    {   
        this.getInputDate();
        this.drawCalendar();
    }

    constructor()
    {        
        let currentDate = moment().date();
        let currentMonth = moment().month();
        let currentYear = moment().year();

        if ( !this.selectedDate )
            this.selectedDate = currentDate;

        if ( !this.selectedMonth )
            this.selectedMonth = moment().month(currentMonth).format("MMMM");

        if ( !this.selectedYear )
            this.selectedYear = currentYear;

        for ( let i = 0; i < 12; i++ )           
            this.months[i] = moment().month(i).format("MMMM");        
        
        this.drawCalendar();
    }

    drawCalendar( )
    {
        let datesInMonth = parseInt(moment().year(this.selectedYear).month(this.selectedMonth).endOf("month").format("D"));

        this.dates = [];

        var week = 1;

        for ( let i = 1; i <= datesInMonth; i++ ) {

            let day = parseInt(moment().year(this.selectedYear).month(this.selectedMonth).date(i).format("d"));

            if ( day == 0 ) day = 7;

            if ( this.dates[week] === undefined )
                this.dates[week] = [];

            this.dates[week][day] = i;

            if ( day == 7 )
                week++;
        }
    }

    setInputDate()
    {
        this.inputDate = moment()
                        .date(this.selectedDate)
                        .month(this.selectedMonth)
                        .year(this.selectedYear)
                        .format(this.format) + " " + this.hours;    

        this.onSelectDate.next(this.inputDate);
    }

    getInputDate()
    {
        if ( this.inputDate !== undefined ) {

            let inputDate = moment(this.inputDate);

            if ( inputDate.isValid() ) {
                this.selectedDate = parseInt(inputDate.format("DD"));
                this.selectedMonth = inputDate.format("MMMM");
                this.selectedYear = parseInt(inputDate.format("YYYY"));

                this.hours = inputDate.format("HH") + ":" + 
                            inputDate.format("mm") + ":" + 
                            inputDate.format("ss");
            }
        }        
    }    

    onSetDate( date:number )
    {
        this.selectedDate = date;
        this.setInputDate();
    }


    onSetMonth( month )
    {
        this.selectedMonth = month
        this.drawCalendar();
        this.setInputDate();
    }

     onSetYear ( year )
     {
        this.drawCalendar();
        this.setInputDate();
     }

     onChangeInputDate( date )
     {
         setTimeout(()=>{
            this.getInputDate();
            this.drawCalendar();
            this.setInputDate();
         }, 1000);             
     }

}