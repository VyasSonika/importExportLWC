/* eslint-disable guard-for-in */
/* eslint-disable no-undef */
import { LightningElement, api, track, wire} from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import { createRecord, updateRecord, deleteRecord } from "lightning/uiRecordApi";
// Static resources
import anychart_gantt from "@salesforce/resourceUrl/anychart";
// Controllers
import getTasks from "@salesforce/apex/GanttData.getTasks";
let col  = [
    {label:'Task', fieldName: 'Name', type: 'text', hideDefaultActions: true, 
        cellAttributes:{ 
        class:{fieldName:'taskColor'}}
    }
]
export default class GanttChartLWC extends LightningElement {
    @track ganttTasks = [];
    @track refreshTable = [];
    @track columns = col;
    @wire(getTasks)
    wireGantt(result){
        this.refreshTable = result;
        if(result.data){
            this.ganttTasks = JSON.parse(JSON.stringify(result.data));
            console.log('gantt chart data', this.ganttTasks);
        }
        if(result.error){
            console.log("Error ",  result.error);
        }
    }
    async connectedCallback(){
        Promise.all([
            await loadScript(this, anychart_gantt + '/Anychart/anychart-core.min.js'),
            loadScript(this, anychart_gantt + '/Anychart/anychart-gantt.min.js')
        ])
        .then(() => {
            console.log('Files loaded');
            this.createChart(this.ganttTasks);
        }).catch(error => {
            console.log("Error ",  error);
        });
    }
    createChart(chartData){
        let data = chartData;
        console.log('gantt chart data', data);
        let tableData = anychart.data.tree(data, 'as-table');
        
        console.log('treeData---', tableData);
         // create project gantt chart
        let chart = anychart.ganttProject();
        console.log('chart-----', chart)
        
        // set data for the chart
        let a = chart.data(tableData);
        console.log('set data for chart---', a);
        // set general splitter pixel position
        chart.splitterPosition(200);
        // console.log('set general splitter pixel position---', chart.splitterPosition(400));
        let dataGrid = chart.dataGrid();
        console.log('dataGrid-----', dataGrid);
        chart.dataGrid().column(0).enabled(false);
        // dataGrid.column(0).title('Acc').setColumnFormat('', 'date-Acc');
        dataGrid
        .column(1)
        .title('Tasks')
        .setColumnFormat('tasks', 'date-tasks');
        dataGrid.tooltip(false);
	    // dataGrid
        // .column(4)
        // .title('US Short')
        // .setColumnFormat('usShort', 'date-us-short');
        // set container id for the chart
        chart.getTimeline().tooltip(false);
        let container = this.template.querySelector('div');
        console.log('container----', container);
        chart.container(container);

        // initiate chart drawing
        chart.draw();

        // show all visible range
        chart.fitAll();
    }
    
}  