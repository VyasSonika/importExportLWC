import { LightningElement, api, track } from 'lwc';
import moment from '@salesforce/resourceUrl/momentjs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class DatePicker extends LightningElement {
    lastClass;
    @track dateContext 
    @track selectedDate 
    @track dates = [];
    @track today;
    year;
    @track month;
    // selectDate;
    async connectedCallback(){
        await loadScript(this, moment + '/moment/moment.js')
        .then(result=>{
            console.log('result', result);
            this.loadActivities();
        })
        
        
    }

    loadActivities(){
        console.log('load activities');
        this.today = window.moment();
        console.log('today', this.today);
        this.dateContext = window.moment();
        console.log('date context', this.dateContext);
        this.selectedDate = window.moment();
        console.log('selectedDate', this.selectedDate);
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
        console.log('inside get month', this.month);
    }

    previousMonth() {
        console.log('previous button')
        this.dateContext = window.moment(this.dateContext).subtract(1, 'month');
        this.getmonth(this.dateContext);
        this.getyear(this.dateContext);

        console.log('inside previous Month', this.dateContext);
        this.refreshDateNodes();
    }

    nextMonth() {
        this.dateContext = window.moment(this.dateContext).add(1, 'month');
        this.getmonth(this.dateContext);
        this.getyear(this.dateContext);
  
        this.refreshDateNodes();
    }
    @api
    goToday() {
        this.selectedDate = this.today.format('MM/DD/YY');
        console.log('inside today selected date', this.selectedDate);
        this.dateContext = this.today;
        this.getmonth(this.dateContext);
        this.getyear(this.dateContext);
        console.log('inside today date context', this.dateContext);

        this.refreshDateNodes();
    }

    @api
    setSelected(e) {
        const selectedDate = this.template.querySelector('.selected');
        console.log('selected date', selectedDate);
        if (selectedDate) {
            selectedDate.className = this.lastClass;
        }

        const { date } = e.target.dataset;
        console.log('date', date);
        this.selectedDate = window.moment(date).format('MM/DD/YY');
        this.dateContext = window.moment(date);
        this.lastClass = e.target.className;
        console.log('lastClass', this.lastClass);
        e.target.className = 'selected';
    }

    refreshDateNodes() {
        this.dates = [];
        const currentMoment = window.moment(this.dateContext);
        console.log('currentMoment', JSON.stringify(currentMoment));
        // startOf mutates moment, hence clone before use
        const start = this.dateContext.clone().startOf('month');
        // console.log('start', JSON.stringify(start));
        const startWeek = start.isoWeek();
        // console.log('startWeek', startWeek);
        // months do not always have the same number of weeks. eg. February
        const numWeeks =
            window.moment.duration(currentMoment.endOf('month') - start).weeks() + 1;
            // console.log('number weeks', numWeeks);
        for (let week = startWeek; week <= startWeek + numWeeks; week++) {
            Array(7)
                .fill(0)
                .forEach((n, i) => {
                    // console.log('n and i', n, i);
                    const day = currentMoment
                        .week(week)
                        .startOf('week')
                        .clone()
                        .add(n + i, 'day');
                    // console.log('day', JSON.stringify(day));
                    let className = '';
                    
                    if (day.month() === this.dateContext.month()) {
                        if (day.isSame(this.today, 'day')) {
                            className = 'today';
                        } else if (day.isSame(this.selectedDate, 'day')) {
                            className = 'selected';
                        } else {
                            className = 'date';
                        }
                    } else {
                        className = 'padder';
                    }
                    this.dates.push({
                        className,
                        formatted: day.format('YYYY-MM-DD'),
                        text: day.format('DD')
                    });
                });
            console.log('dates array', this.dates);
        }
    }
    handleCustomDate(){
        const evt = new CustomEvent('selectdate', {
            detail: this.selectedDate, 
        });
        this.dispatchEvent(evt);
        console.log('inside handlecustomdate', evt);
    }
}