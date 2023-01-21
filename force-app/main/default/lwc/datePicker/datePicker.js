import { LightningElement, api, track } from 'lwc';
import moment from '@salesforce/resourceUrl/momentjs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class DatePicker extends LightningElement {
    lastClass;
    @track dateContext;
    @track selectedDate;
    @track dates = [];
    @track today;
    year;
    @track month;
    // selectDate;
    async connectedCallback(){
        await loadScript(this, moment + '/moment/moment.js')
        .then(result=>{
            // console.log('result', result);
            this.loadActivities();
        })
    }

    loadActivities(){
        // console.log('load activities');
        this.today = window.moment();
        // console.log('today', this.today);
        this.dateContext = window.moment();
        // console.log('date context', this.dateContext);
        this.selectedDate = window.moment();
        // console.log('selectedDate', this.selectedDate);
        this.getformattedSelectedDate(this.selectedDate);
        this.getyear(this.dateContext);
        this.getmonth(this.dateContext);
        this.refreshDateNodes();
    }

    getformattedSelectedDate(selectedDate) {
         this.selectedDate= selectedDate.format('MM/DD/YY');
    }
    getyear(datecontext) {
        // return console.log('inside get',this.dateContext);
        // this.dateContext.format('YYYY ');
        this.year = datecontext.format('Y');
    }
    getmonth(datecontext) {
        // return this.dateContext.format('MM');
        this.month = datecontext.format('MMMM');
        // console.log('inside get month', this.month);
    }
    @api
    showChild(){
         console.log('inside showchild component');
        // this.template.querySelector('.date').style.display = "block";
    }
    @api
    hideChild(){
         console.log('inside hidechild component');
        // this.template.querySelector('.date').style.display = "none";
       
    }
    previousMonth() {
        // console.log('previous button')
        this.dateContext = window.moment(this.dateContext).subtract(1, 'month');
        this.getmonth(this.dateContext);
        this.getyear(this.dateContext);

        // console.log('inside previous Month', this.dateContext);
        this.refreshDateNodes();
    }

    nextMonth() {
        this.dateContext = window.moment(this.dateContext).add(1, 'month');
        this.getmonth(this.dateContext);
        this.getyear(this.dateContext);
  
        this.refreshDateNodes();
    }
    goToday() {
        this.selectedDate = this.today.format('MM/DD/YY');
        console.log('inside today selected date', this.selectedDate);
        this.dateContext = this.today;
        this.getmonth(this.dateContext);
        this.getyear(this.dateContext);
        // console.log('inside today date context', this.dateContext);
        this.handleCustomDate(this.selectedDate);
        
        this.refreshDateNodes();
    }
    setSelected(e) {
        const selectedDate = this.template.querySelector('.selected');
        // console.log('selected date', selectedDate);
        if (selectedDate) {
            selectedDate.className = this.lastClass;
        }

        const { date } = e.target.dataset;
        console.log('date', date);
        this.selectedDate = window.moment(date).format('MM/DD/YY');
        this.dateContext = window.moment(date);
        this.lastClass = e.target.className;
        console.log('lastClass', this.lastClass);
        // this.handleCustomDate(this.selectedDate);

        e.target.className = 'selected';
        this.handleCustomDate(this.selectedDate);

    }

    refreshDateNodes() {
        this.dates = [];
        const currentMoment = window.moment(this.dateContext);
        // console.log('currentMoment', JSON.stringify(currentMoment));
        // startOf mutates moment, hence clone before use
        const start = this.dateContext.startOf('month');
        // const startYear = this.dateContext.startOf('year');
        // console.log('start year', startYear);
        // console.log('start', JSON.stringify(start));
        const startWeek = start.isoWeek();
        // console.log('startWeek', JSON.stringify(startWeek));
        // months do not always have the same number of weeks. eg. February
        const numWeeks =
            window.moment.duration(currentMoment.endOf('month') - start).weeks() + 1;
            // console.log('number weeks', numWeeks);
        for (let week = startWeek; week <= startWeek + numWeeks; week++) {
        //    console.log('Array(7)', Array(7).fill(0));
            Array(7)
                .fill(0)
                .forEach((n, i) => {
                    // console.log('n and i', n, i);
                    const day = window.moment()
                        .week(week)
                        .startOf('week')
                        .clone()
                        .add(n + i, 'day');
                    // console.log('day currentMoment', JSON.stringify(currentMoment));
                    // console.log('day of start week', JSON.stringify(currentMoment.week(week).startOf('week')));
                    // console.log('day week clone',  JSON.stringify(currentMoment.week(week).startOf('week').clone()));
                    // console.log('day week clone add',  JSON.stringify(currentMoment.week(week).startOf('week').clone().add(n + i, 'day')));
                    // console.log('day', day);
                    // console.log('day of month', day.month());
                    // console.log('datcontext month', this.dateContext.month());
                    // console.log('day  isSame today', day.isSame(this.today, 'day'));
                    // console.log('day  isSame selected date', day.isSame(this.selectedDate, 'day'));
                    // console.log('day year', day.year());
                    let className = '';
                    // console.log('day of month:-', day.month());
                    // console.log('date of context:-', this.dateContext.month());
                    if (day.month() === this.dateContext.month()) {
                        if (day.isSame(this.today, 'day')) {
                            className = 'today';
                            // console.log('class name today');
                        } else if (day.isSame(this.selectedDate, 'day')) {
                            className = 'selected';
                            // console.log('class name seleted');

                        } else {
                            className = 'date';
                            // console.log('class name date');

                        }
                    } else {
                        className = 'padder';
                        // console.log('class name padder');

                    }
                    this.dates.push({
                        className,
                        formatted: day.format('MM/DD/YY'),
                        text: day.format('DD')
                    });
                });
            // console.log('dates array', this.dates);
        }
    }
    handleCustomDate(selectedDate){
        this.selectedDate = selectedDate;
        console.log('inside custom event',this.selectedDate);
        const evt = new CustomEvent('selectdate', {
            detail: this.selectedDate,
        });
        console.log('inside handlecustomdate', evt);

        this.dispatchEvent(evt);
    }
}