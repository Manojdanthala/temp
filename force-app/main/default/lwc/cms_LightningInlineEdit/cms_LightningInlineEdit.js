import { LightningElement,wire,track } from 'lwc';
import getAllCase from '@salesforce/apex/GetAllCases.getAllCase';
import UpdateSplitTransfer from '@salesforce/apex/GetAllCases.UpdateSplitTransfer';
export default class Cms_LightningInlineEdit extends LightningElement {
    @track error;
    data = [];
    index = 0;
    @wire(getAllCase)
    wiredOpps({error,data}) {
        if (data) {
            this.data = JSON.parse(data);
            this.splitdtdata = JSON.parse(data);
            console.log('DATAAAAAAAAAA'+data);
        } else if (error) {
            this.error = error;
        }
    }
    splitoptions = [
        {label: '1', value:'1'},
        {label: '2', value:'2'}
    ];
    isModalOpen = true;
    handleClick(event){
        this.isModalOpen = true;
    }


    selectedsplitoption;
    splitdtdata = [];
    splittempdata = [];
    handlesplitnumber(event){
        const field = event.target.name;
        if (field === 'optionSelect') {
            this.selectedsplitoption = event.target.value;
        }
        for(let i=0;i<this.selectedsplitoption;i++){
            this.splitdtdata = [...this.splitdtdata,{caseNumber: this.splitdtdata[0].CaseNumber,Id: this.splitdtdata[0].Id, volume__c: '', Status: this.splitdtdata[0].Status}];
        }   
        
        console.log('---------'+JSON.stringify(this.splitdtdata));
    }

    calculateSplitDifference(event){
        this.splitdtdata[event.target.dataset.row].volume__c = event.target.value;

        let firstrowvolume = 0;
        let allvolumessum = 0;
        console.log('------1--'+firstrowvolume);
        console.log('------12--'+JSON.stringify(this.splitdtdata));
        for(let i=0;i<this.splitdtdata.length;i++){
            console.log('------i volume--'+this.splitdtdata[i].volume__c);
            if(i==0){
                console.log('IN FIRST');
                firstrowvolume = this.splitdtdata[i].volume__c;
            } else{
                if(this.splitdtdata[i].volume__c!=''){
                    console.log('IN ELSE'+parseInt(this.splitdtdata[i].volume__c));
                    allvolumessum = parseInt(allvolumessum) + parseInt(this.splitdtdata[i].volume__c);
                }
                
            }
        }

        console.log('firstrowvolume--------'+firstrowvolume);
        console.log('allvolumessum--------'+allvolumessum);

    }

    
    submitDetails(event){
        console.log('Inside SubmitDetails');
        
        var casestoupdatelist = [];

        var existingrecord = new Object();
        existingrecord.Id = this.splitdtdata[0].Id;
        existingrecord.volume = this.splitdtdata[0].volume__c;
        existingrecord.status = this.splitdtdata[0].Status;
        console.log('existingrecord---------->'+JSON.stringify(existingrecord));

        var casestoinsertlist = [];
        for(let i=0;i<this.splitdtdata.length;i++){

            console.log('ALLLLLL'+JSON.stringify(this.splitdtdata[i]));
            if(i>0){
                var newcaserecord = new Object();
                newcaserecord.Id = this.splitdtdata[i].Id;
                newcaserecord.volume = this.splitdtdata[i].volume__c;
                newcaserecord.status = this.splitdtdata[i].Status;
                console.log('newcaserecord---------->'+JSON.stringify(newcaserecord));
                casestoinsertlist.push(newcaserecord);
            }
            
        }
        console.log('casestoinsertlist---------->'+JSON.stringify(casestoinsertlist));

        UpdateSplitTransfer({transferUpdateP: JSON.stringify(existingrecord), transferInsertP: JSON.stringify(casestoinsertlist)})
            .then(result => {
                console.log('Sucess');
                //this.contacts = result;
            })
            .catch(error => {
                this.error = error;
            });

    }
    
    handleClick(event){
        console.log('Inser'+event.target.dataset.row);
        console.log('array full'+JSON.stringify(this.splitdtdata));
        //this.splitdtdata = this.splitdtdata.splice(event.target.dataset.row,1);
        
        var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

            for( var i = 0; i < arr.length; i++){ 
            
                if ( arr[i] === 5) { 
            
                    arr.splice(i, 1); 
                }
            
            }
        alert(arr);
        console.log(this.splitdtdata.length);
        if(this.splitdtdata.length>=1){             
            this.splitdtdata.splice(event.target.dataset.row,1);
            this.index-1;
       }
        /*
        var temp = [];
        this.temp = this.splitdtdata;
        console.log('TEMPPP'+this.temp);
        for( let i = 0; i < this.temp.length; i++){ 
            console.log('i---->'+i);
            console.log('event.target.dataset.row---->'+event.target.dataset.row);
            if ( i == event.target.dataset.row) {
                console.log('Enterrr');
                this.temp.splice(i, 1); 
                //this.index--;
                console.log('TEMPPP Inside loop'+JSON.stringify(this.temp));
            }
        }

        console.log('TEMPPP'+JSON.stringify(this.temp));
        */
        //this.splitdtdata = this.splitdtdata.filter(record => record.);
        
       //elete this.splitdtdata[event.target.dataset.row];
        console.log('array finallllllllllllll'+JSON.stringify(this.splitdtdata));
    }

}